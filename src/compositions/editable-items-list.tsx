'use client';

import { EditableItem } from '@/components/editable-item';
import { markDoublets } from '@/helpers/mark-doublets';
import { LearnItem } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

type Props = {
  listId: string;
  items?: LearnItem[];
  canAdd?: boolean; // e.g. listing only flagged items
  filterBy?: {
    search?: string;
    doublets?: boolean;
  };
};

export const EditableItemsList: FC<Props> = ({
  listId,
  items = [],
  canAdd = true,
  filterBy: { search, doublets } = {},
}) => {
  const router = useRouter();

  // not yet saved items
  const [unsavedItemIds, setUnsavedItemIds] = useState<number[]>(canAdd ? [1] : []);
  const onNewItemEdited = () => {
    setUnsavedItemIds((ids) => [...ids, ids[ids.length - 1] + 1]);
  };

  // newly saved items: bridge time between saved and refreshed and rendered
  const [newItems, setNewItems] = useState<LearnItem[]>([]);
  const onNewItemSaved = (item: LearnItem, tempId: string) => {
    setNewItems((items) => [...items, item]);
    setUnsavedItemIds((ids) => ids.filter((id) => `${id}` !== tempId));
    router.refresh();
  };

  const onItemDeleted = (id: string) => {
    setNewItems((items) => items.filter((item) => id !== item.id));
    router.refresh();
  };

  // TODO: hints
  // const { onDismissHint, hintDismissed } = useSettings();
  // const showHint = isEditing && !items.length && !hintDismissed(Hints.editingIntro);

  let filteredItems = [
    ...items,
    ...newItems.filter(({ id }) => !items.find((item) => item.id === id)),
  ];
  if (doublets) {
    filteredItems = filteredItems
      .map((item, i) => ({ ...item, index: i + 1 }))
      .filter((item) => typeof item.doubletOf === 'number');
  }
  if (search) {
    const searchLowerCase = search.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.prompt.toLowerCase().includes(searchLowerCase) ||
        item.promptAddition?.toLowerCase().includes(searchLowerCase) ||
        item.solution.toLowerCase().includes(searchLowerCase),
    );
  }

  return (
    <ul>
      {markDoublets(filteredItems).map((item, i) => (
        <li key={item.id} className="border-t-4 border-dotted border-gray-85 pt-4 pb-1">
          <EditableItem
            item={item}
            index={item.index || i + 1}
            listId={listId}
            onItemDeleted={onItemDeleted}
          />
        </li>
      ))}

      {unsavedItemIds.map((id) => (
        <li key={id} className="border-t-4 border-dotted border-gray-85 pt-4 pb-1">
          <EditableItem
            // TODO: hints
            // onDismissHint={showHint && (() => onDismissHint(Hints.editingIntro))}
            item={getTempItem(id)}
            listId={listId}
            onNewItemEdited={onNewItemEdited}
            onNewItemSaved={onNewItemSaved}
          />
        </li>
      ))}
    </ul>
  );
};

const getTempItem = (id: number) => ({
  id: `${id}`,
  prompt: '',
  solution: '',
  isNew: true,
});
