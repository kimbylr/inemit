import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { EditStatus } from '../components/edit-status';
import { FlagButton } from '../components/flag-button';
import { Icon } from '../elements/icon';
import { Input } from '../elements/input';
import { Label } from '../elements/label';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, LearnItem, LearnItemForEditing } from '../models';

interface Props {
  listId: string;
  index: number;
  item: LearnItemForEditing;
  lastInputRef?: React.RefObject<HTMLInputElement>;
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
  onItemDeleted = () => {},
  onItemSaved = () => {},
  onNewItemEdited = () => {},
  onNewItemSaved = () => {},
}) => {
  const { addItems, deleteItem, editItem } = useApi();
  const [savedItem, setSavedItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
  });
  const [currentItem, setCurrentItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    solution: item.solution,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const submit = async (
    event: React.MouseEvent | React.FocusEvent | React.FormEvent,
  ) => {
    event.preventDefault();

    if (!canSave) {
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
        const { prompt, solution } = savedItem;
        setSavedItem({ prompt, solution });
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

  const { flagged, doubletOf } = item;
  const isDoublet = typeof doubletOf === 'number';
  const doubletTitle = isDoublet
    ? `Vokabel ist ein Duplikat von ${doubletOf! + 1}`
    : undefined;

  return (
    <Container onSubmit={submit}>
      <MetaColumn>
        {flagged ? (
          <FlagButton flagged={flagged} listId={listId} itemId={item.id} />
        ) : (
          <Index>{index}</Index>
        )}
        {!item.isNew && (
          <DeleteButton
            type="button"
            tabIndex={-1}
            onClick={onDelete}
            title="Löschen"
          >
            <Icon type="deleteInCircle" />
          </DeleteButton>
        )}
      </MetaColumn>

      <InputsColumn>
        <LabelWithSpacing>
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
        </LabelWithSpacing>
        <LabelWithSpacing>
          <Input
            autoCapitalize="none"
            onBlur={submit}
            value={currentItem.prompt}
            placeholder={savedItem.prompt}
            onChange={e => onChangePrompt(e.target.value)}
          />
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

const SolutionInput = styled(Input)<{ doublet?: boolean }>`
  ${({ doublet, theme: { colors } }) =>
    doublet ? `border-color: ${colors.orange[100]}` : ''}
`;

const LabelWithSpacing = styled(Label)`
  margin-right: 20px;
  margin-bottom: 12px;
  flex-basis: 200px;
  flex-grow: 1;
`;