import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { EditStatus } from '../components/edit-status';
import { FlagButton } from '../components/flag-button';
import { Hint } from '../elements/hint';
import { Icon } from '../elements/icon';
import { Input } from '../elements/input';
import { Label } from '../elements/label';
import { UnsplashImage } from '../helpers/unsplash';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, LearnItem, LearnItemForEditing } from '../models';
import { ImagePicker } from './image-picker';

interface Props {
  listId: string;
  index: number;
  item: LearnItemForEditing;
  lastInputRef?: React.RefObject<HTMLInputElement>;
  onDismissHint?: false | (() => void);
  onItemDeleted?(id: string): void;
  onItemSaved?(item: LearnItem): void;
  onNewItemEdited?(): void;
  onNewItemSaved?(item: LearnItem, tempId: string): void;
}

export const EditableItem: FC<Props> = ({
  listId,
  index,
  item,
  lastInputRef,
  onDismissHint,
  onItemDeleted = () => {},
  onItemSaved = () => {},
  onNewItemEdited = () => {},
  onNewItemSaved = () => {},
}) => {
  const { addItems, deleteItem, editItem } = useApi();
  const [savedItem, setSavedItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
    image: item.image,
  });
  const [currentItem, setCurrentItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
    image: item.image,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [initiallyEdited, setInitiallyEdited] = useState(!item.isNew);
  const hasEdited = () => {
    if (!initiallyEdited) {
      onNewItemEdited();
      setInitiallyEdited(true);
    }
  };

  const onChangePrompt = (value: string) => {
    setCurrentItem(item => ({ ...item, prompt: value }));
    hasEdited();
  };
  const onChangeSolution = (value: string) => {
    setCurrentItem(item => ({ ...item, solution: value }));
    hasEdited();
  };

  const saved =
    !item.isNew &&
    currentItem.prompt === savedItem.prompt &&
    currentItem.solution === savedItem.solution;
  const canSave = !!currentItem.prompt && !!currentItem.solution && !saved;

  const submit = async (event: React.MouseEvent | React.FocusEvent | React.FormEvent) => {
    event.preventDefault();

    if (!canSave || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    if (item.isNew) {
      try {
        const [newItem] = await addItems({ listId, items: [currentItem] });
        onNewItemSaved && onNewItemSaved(newItem, item.id);
      } catch (error) {
        setSaving(false);
        setError('Fehler beim speichern. Klicken, um nochmals zu versuchen.');
      }
    } else {
      try {
        const savedItem = await editItem({
          listId,
          itemId: item.id,
          item: { prompt: currentItem.prompt, solution: currentItem.solution },
        });
        const { prompt, solution, image } = savedItem;
        setSavedItem({ prompt, solution, image });
        onItemSaved(savedItem); // TODO: propagate to store
      } catch (error) {
        setError('Fehler beim speichern. Klicken, um nochmals zu versuchen.');
      } finally {
        setSaving(false);
      }
    }
  };

  const onDelete = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!confirm('Diesen Eintrag löschen?')) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteItem({ listId, itemId: item.id });
      onItemDeleted(item.id);
    } catch (error) {
      setSaving(false);
      setError('Löschen hat nicht geklappt. Bitte nochmals versuchen.');
    }
  };

  const onSetImage = async (img: UnsplashImage | null) => {
    if (!initiallyEdited || saving) {
      return;
    }

    setSaving(true);
    try {
      const { prompt, solution, image } = await editItem({
        listId,
        itemId: item.id,
        item: { image: img }, // TODO: don't send trackSet
      });
      if (img !== null && !image) throw 'could not save image';
      setSavedItem({ prompt, solution, image });
      setCurrentItem({ prompt, solution, image });
      setShowImagePicker(false);
      img?.trackSet?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const { flagged, doubletOf } = item;
  const isDoublet = typeof doubletOf === 'number';
  const doubletTitle = isDoublet
    ? `Vokabel ist ein Duplikat von ${doubletOf! + 1}`
    : undefined;

  return (
    <>
      <Container onSubmit={submit}>
        <MetaColumn>
          {flagged ? (
            <FlagButton flagged={flagged} listId={listId} itemId={item.id} />
          ) : (
            <Index>{index}</Index>
          )}
          {!item.isNew && (
            <DeleteButton type="button" tabIndex={-1} onClick={onDelete} title="Löschen">
              <Icon type="deleteInCircle" />
            </DeleteButton>
          )}
        </MetaColumn>

        <InputsColumn>
          <SolutionContainer>
            {onDismissHint && (
              <Hint onDismiss={onDismissHint} triangle>
                <>
                  Hier schreibst du rein, was du lernen willst (z.B. <em>il gatto</em>).
                </>
                <>
                  Optionales in Klammern: <em>(il) gatto</em> akzeptiert <em>il gatto</em>{' '}
                  oder <em>gatto</em> als Lösung.
                </>
                <>
                  Mehrere mögliche Lösungen mit Komma abtrennen: <em>certo, sicuro</em>{' '}
                  heisst, <em>certo</em> und <em>sicuro</em> sind beide richtig.
                </>
              </Hint>
            )}
            <Label>
              <SolutionInput
                doublet={isDoublet}
                title={doubletTitle}
                autoCapitalize="none"
                onBlur={submit}
                value={currentItem.solution}
                placeholder={savedItem.solution}
                onChange={e => onChangeSolution(e.target.value)}
                ref={lastInputRef}
              />
              Vokabel
            </Label>
          </SolutionContainer>
          <LabelWithSpacing>
            <InputWithImageButton>
              <Input
                autoCapitalize="none"
                onBlur={submit}
                value={currentItem.prompt}
                placeholder={savedItem.prompt}
                onChange={e => onChangePrompt(e.target.value)}
              />
              {!item.isNew && (
                <ImageButtonContainer style={{ position: 'relative' }}>
                  <ImageButton
                    type="button"
                    isActive={showImagePicker}
                    onClick={() => setShowImagePicker(active => !active)}
                  >
                    {currentItem.image ? (
                      <ImageThumbContainer showImagePicker={showImagePicker}>
                        <ImageThumb src={currentItem.image.urls.thumb} />
                        <Icon type="edit" />
                      </ImageThumbContainer>
                    ) : (
                      <Icon type="image" width="32px" />
                    )}
                  </ImageButton>
                  {currentItem.image && (
                    <ImageDeleteButton
                      type="button"
                      tabIndex={-1}
                      onClick={() => onSetImage(null)}
                      title="Bild entfernen"
                    >
                      <Icon type="deleteInCircle" width="16px" />
                    </ImageDeleteButton>
                  )}
                </ImageButtonContainer>
              )}
            </InputWithImageButton>
            Abfrage
          </LabelWithSpacing>
        </InputsColumn>

        <EditStatus
          isNew={item.isNew}
          canSave={canSave}
          saving={saving}
          saved={saved}
          error={error}
          submit={submit}
        />
      </Container>

      {showImagePicker && (
        <ImagePickerContainer>
          <ImagePicker searchTerm={currentItem.solution} onSetImage={onSetImage} />
        </ImagePickerContainer>
      )}
    </>
  );
};

const Container = styled.form`
  display: flex;
  align-items: center;
`;

const MetaColumn = styled.div`
  width: 20px;
  align-self: stretch;
  flex-shrink: 0;
  font-size: ${({ theme: { font } }) => font.sizes.xxs};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 12px;
  margin-bottom: 12px;
`;

const Index = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme: { colors } }) => colors.grey[75]};
`;

const DeleteButton = styled.button`
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: ${({ theme: { colors } }) => colors.negative[50]};

  :hover {
    color: ${({ theme: { colors } }) => colors.negative[100]};
  }
`;

const InputsColumn = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
`;

const InputWithImageButton = styled.div`
  display: flex;
  align-items: center;
`;

const ImageButtonContainer = styled.div`
  margin-left: 0.5rem;
`;

const ImageButton = styled(DeleteButton)<{ isActive: boolean }>`
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.grey[25] : colors.grey[75]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }

  :focus > svg {
    filter: drop-shadow(0 0 4px ${({ theme: { colors } }) => colors.primary[100]});
  }
`;

const ImageThumbContainer = styled.div<{ showImagePicker: boolean }>`
  position: relative;

  img {
    opacity: ${({ showImagePicker }) => (showImagePicker ? '0.5' : '1')};
  }
  :hover img {
    opacity: 0.5;
  }

  // edit icon
  > svg {
    position: absolute;
    color: ${({ theme: { colors } }) => colors.grey[25]};
    top: 0.5rem;
    height: 1.25rem;
    left: 0;
    display: ${({ showImagePicker }) => (showImagePicker ? 'block' : 'none')};
    filter: drop-shadow(0 0 4px white);
  }
  :hover svg {
    display: block;
  }
`;

const ImageDeleteButton = styled(DeleteButton)`
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  background: ${({ theme: { colors } }) => colors.grey[98]};
  border-radius: 1rem; // full
  padding: 2px;
  line-height: 0;

  :hover {
    color: ${({ theme: { colors } }) => colors.negative[100]};
  }
`;

const ImageThumb = styled.img`
  height: 36px;
  margin-bottom: 2px;
  width: auto;
  border-radius: 2px;
`;

const SolutionInput = styled(Input)<{ doublet?: boolean }>`
  ${({ doublet, theme: { colors } }) =>
    doublet ? `border-color: ${colors.orange[100]}` : ''}
`;

const SolutionContainer = styled.div`
  position: relative;
  margin-right: 20px;
  margin-bottom: 12px;
  flex-basis: 200px;
  flex-grow: 1;
`;

const LabelWithSpacing = styled(Label)`
  margin-right: 20px;
  margin-bottom: 12px;
  flex-basis: 200px;
  flex-grow: 1;
`;

const ImagePickerContainer = styled.div`
  margin-left: 32px; // 20px + 12px
  margin-right: 44px; // 20px + 24px
`;
