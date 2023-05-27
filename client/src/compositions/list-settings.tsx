import React, { FC, useState } from 'react';
import { Modal } from '../components/modal';
import { EditListName } from '../compositions/edit-list-name';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { LearnItem, ListSummary } from '../models';

const DELETE_PROMPT = `Gib "JA" ein, um diese Liste unwiderruflich zu löschen.`;

type Props = {
  list: ListSummary;
  onListNameChanged: (name: string) => void;
  onItemsAdded: (newItems: LearnItem[]) => void;
};

export const ListSettings: FC<Props> = ({ list, onListNameChanged, onItemsAdded }) => {
  const [show, setShow] = useState(false);
  const { deleteList } = useApi();
  const { removeList } = useLists();

  const onListDeleted = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (prompt(DELETE_PROMPT) !== 'JA') {
      return;
    }

    try {
      await deleteList(list.id);
      removeList(list.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button className="w-6 h-6 text-grey-75 hover:text-grey-50" onClick={() => setShow(true)}>
        <Icon type="settings" />
      </button>

      {show && (
        <Modal title="Einstellungen" onClose={() => setShow(false)}>
          <h3 className="">Umbenennen</h3>
          <p className="mb-4 text-xs+">Zeit für einen neuen Namen?</p>
          <EditListName
            currentName={list.name}
            listId={list.id}
            onNameChanged={onListNameChanged}
          />

          <hr className="mb-4 -mx-8" />

          <h3>Löschen</h3>
          <p className="mb-3 text-xs+">Diese Liste und alle Inhalte unwider&shy;ruflich löschen</p>
          <Button onClick={onListDeleted} caution className="w-full">
            <Icon type="delete" width="14px" /> Liste löschen
          </Button>
        </Modal>
      )}
    </div>
  );
};
