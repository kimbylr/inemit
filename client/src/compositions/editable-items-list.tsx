import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { EditableItem } from '../components/editable-item';
import { useRouting } from '../hooks/use-routing';
import { useSettings } from '../hooks/use-settings';
import { Hints, LearnItem } from '../models';

type Props = {
  items: LearnItem[];
  listId: string;
  onItemsAdded: (newItems: LearnItem[]) => void;
  onItemDeleted: (id: string) => void;
  onItemSaved: (editedItem: LearnItem) => void;
};

export const EditableItemsList: FC<Props> = ({
  items,
  listId,
  onItemsAdded,
  onItemDeleted,
  onItemSaved,
}) => {
  const { isEditing } = useRouting();
  const { onDismissHint, hintDismissed } = useSettings();
  const [newItemIds, setNewItemIds] = useState<number[]>([1]);

  const onNewItemEdited = () => {
    setNewItemIds((ids) => [...ids, ids[ids.length - 1] + 1]);
  };

  const onNewItemSaved = (item: LearnItem, tempId: string) => {
    setNewItemIds((ids) => ids.filter((id) => `${id}` !== tempId));
    onItemsAdded([item]);
  };

  const showHint = isEditing && !items.length && !hintDismissed(Hints.editingIntro);

  return (
    <LearnItemList>
      {items.map((item, i) => (
        <LearnItemListElement key={item.id}>
          <EditableItem
            item={item}
            index={item.index || i + 1}
            listId={listId}
            onItemDeleted={onItemDeleted}
            onItemSaved={onItemSaved}
          />
        </LearnItemListElement>
      ))}

      {newItemIds.map((id) => {
        const item = {
          id: `${id}`,
          prompt: '',
          solution: '',
          isNew: true,
        };

        return (
          <LearnItemListElement key={item.id}>
            <EditableItem
              onDismissHint={showHint && (() => onDismissHint(Hints.editingIntro))}
              item={item}
              listId={listId}
              onNewItemEdited={onNewItemEdited}
              onNewItemSaved={onNewItemSaved}
            />
          </LearnItemListElement>
        );
      })}
    </LearnItemList>
  );
};

const LearnItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const LearnItemListElement = styled.li`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 16px 0 4px;
`;
