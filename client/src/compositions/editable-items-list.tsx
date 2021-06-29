import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { EditableItem } from '../components/editable-item';
import { useRouting } from '../hooks/use-routing';
import { useSettings } from '../hooks/use-settings';
import { Hints, LearnItem, LearnItemWithDoublet } from '../models';

type Props = {
  items: LearnItemWithDoublet[];
  listId: string;
  lastInputRef?: React.MutableRefObject<HTMLInputElement | null>;
  onItemsAdded: (newItems: LearnItem[]) => void;
  onItemDeleted: (id: string) => void;
  onItemSaved: (editedItem: LearnItem) => void;
};

export const EditableItemsList: FC<Props> = ({
  items,
  listId,
  lastInputRef,
  onItemsAdded,
  onItemDeleted,
  onItemSaved,
}) => {
  const { isEditing } = useRouting();
  const { onDismissHint, hintDismissed } = useSettings();
  const [newItemIds, setNewItemIds] = useState<number[]>([1]);

  const onNewItemEdited = () => {
    setNewItemIds(ids => [...ids, ids[ids.length - 1] + 1]);
  };

  const onNewItemSaved = (item: LearnItem, tempId: string) => {
    setNewItemIds(ids => ids.filter(id => `${id}` !== tempId));
    onItemsAdded([item]);
  };

  const showHint = isEditing && !items.length && !hintDismissed(Hints.editingIntro);

  return (
    <LearnItemList>
      {items.map((item, index) => (
        <LearnItem key={item.id}>
          <EditableItem
            item={item}
            index={index + 1}
            listId={listId}
            onItemDeleted={onItemDeleted}
            onItemSaved={onItemSaved}
          />
        </LearnItem>
      ))}

      {newItemIds.map((id, index) => {
        const isLast = index + 1 === newItemIds.length;
        const item = {
          id: `${id}`,
          prompt: '',
          solution: '',
          isNew: true,
        };

        return (
          <LearnItem key={item.id}>
            <EditableItem
              onDismissHint={showHint && (() => onDismissHint(Hints.editingIntro))}
              item={item}
              index={items.length + index + 1}
              listId={listId}
              onNewItemEdited={onNewItemEdited}
              onNewItemSaved={onNewItemSaved}
              lastInputRef={isLast ? lastInputRef : undefined}
            />
          </LearnItem>
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
const LearnItem = styled.li`
  border-top: 4px dotted ${({ theme: { colors } }) => colors.grey[85]};
  padding: 16px 0 4px;
`;
