import { FC, useState } from 'react';
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
    <ul>
      {items.map((item, i) => (
        <li key={item.id} className="border-t-4 border-dotted border-grey-85 pt-4 pb-1">
          <EditableItem
            item={item}
            index={item.index || i + 1}
            listId={listId}
            onItemDeleted={onItemDeleted}
            onItemSaved={onItemSaved}
          />
        </li>
      ))}

      {newItemIds.map((id) => {
        const item = {
          id: `${id}`,
          prompt: '',
          solution: '',
          isNew: true,
        };

        return (
          <li key={item.id} className="border-t-4 border-dotted border-grey-85 pt-4 pb-1">
            <EditableItem
              onDismissHint={showHint && (() => onDismissHint(Hints.editingIntro))}
              item={item}
              listId={listId}
              onNewItemEdited={onNewItemEdited}
              onNewItemSaved={onNewItemSaved}
            />
          </li>
        );
      })}
    </ul>
  );
};
