import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { EditStatus } from '../components/edit-status';
import { FlagButton } from '../components/flag-button';
import { Hint } from '../elements/hint';
import { Icon } from '../elements/icon';
import { TextField } from '../elements/text-field';
import { UnsplashImage } from '../helpers/unsplash';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, LearnItem, LearnItemForEditing } from '../models';
import { ImagePicker } from './image-picker';
import { Modal } from './modal';

interface Props {
  listId: string;
  index?: number;
  item: LearnItemForEditing;
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
    flagged: item.flagged,
    image: item.image,
  });
  const [currentItem, setCurrentItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
    flagged: item.flagged,
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
    setCurrentItem((item) => ({ ...item, prompt: value }));
    hasEdited();
  };
  const onChangeSolution = (value: string) => {
    setCurrentItem((item) => ({ ...item, solution: value }));
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
          item: {
            prompt: currentItem.prompt,
            solution: currentItem.solution,
            flagged: false,
          },
        });
        const { prompt, solution, image, flagged } = savedItem;
        setSavedItem({ prompt, solution, image, flagged });
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
      const { prompt, solution, image, flagged } = await editItem({
        listId,
        itemId: item.id,
        item: { image: removeTrackSet(img), flagged: false },
      });
      if (img !== null && !image) throw 'could not save image';
      setSavedItem({ prompt, solution, image, flagged });
      setCurrentItem({ prompt, solution, image, flagged });
      setShowImagePicker(false);
      img?.trackSet?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const isDoublet = typeof item.doubletOf === 'number';
  const doubletTitle = isDoublet
    ? `Vokabel ist ein Duplikat von ${item.doubletOf! + 1}`
    : undefined;

  return (
    <>
      <form onSubmit={submit} className="flex items-start">
        <div className="w-5 self-stretch shrink-0 flex flex-col justify-between mr-3 mb-4">
          {item.flagged ? (
            <FlagButton
              flagged={savedItem.flagged}
              listId={listId}
              itemId={item.id}
              onFlagged={(flagged) => setSavedItem((item) => ({ ...item, flagged }))}
            />
          ) : (
            <span className="text-xxs text-grey-75 flex justify-center">{index}</span>
          )}
          {!item.isNew && (
            <DeleteButton type="button" tabIndex={-1} onClick={onDelete} title="Löschen">
              <Icon type="deleteInCircle" />
            </DeleteButton>
          )}
        </div>

        <InputsColumn>
          <div className="mr-5 mb-3 basis-[200px] flex-grow relative">
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

            <TextField
              className={isDoublet ? '!border-orange-100' : ''}
              title={doubletTitle}
              autoCapitalize="none"
              onBlur={submit}
              value={currentItem.solution}
              placeholder={savedItem.solution}
              onChange={(e) => onChangeSolution(e.target.value)}
              label="Vokabel"
              autoComplete="off"
            />
          </div>
          <div className="mr-5 mb-3 basis-[200px] flex-grow">
            <div className="flex items-start">
              <div className="flex-grow">
                <TextField
                  autoCapitalize="none"
                  onBlur={submit}
                  value={currentItem.prompt}
                  placeholder={savedItem.prompt}
                  onChange={(e) => onChangePrompt(e.target.value)}
                  label="Abfrage"
                />
              </div>
              {!item.isNew && (
                <div className="relative ml-2 h-10 flex items-center">
                  <ImageButton
                    type="button"
                    isActive={showImagePicker}
                    onClick={() => setShowImagePicker((active) => !active)}
                  >
                    {currentItem.image ? (
                      <ImageThumbContainer showImagePicker={showImagePicker}>
                        <img
                          src={currentItem.image.urls.thumb}
                          className="h-9 mb-0.5 rounded-sm w-auto"
                        />
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
                </div>
              )}
            </div>
          </div>
        </InputsColumn>

        <div className="flex items-center self-stretch mb-9">
          <EditStatus
            isNew={item.isNew}
            canSave={canSave}
            saving={saving}
            saved={saved}
            error={error}
            submit={submit}
          />
        </div>
      </form>

      {showImagePicker && (
        <Modal
          title="Bild hinzufügen"
          onClose={() => setShowImagePicker(false)}
          width="md"
        >
          <ImagePicker searchTerm={currentItem.solution} onSetImage={onSetImage} />
        </Modal>
      )}
    </>
  );
};

const removeTrackSet = (img: UnsplashImage | null) => {
  if (!img) {
    return null;
  }

  const { trackSet, ...rest } = img;
  return rest;
};

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

const ImageButton = styled(DeleteButton)<{ isActive: boolean }>`
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.grey[25] : colors.grey[75]};

  :hover {
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }

  :focus-visible > svg {
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
