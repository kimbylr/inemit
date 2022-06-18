import React, { FC, useState } from 'react';
import { Modal } from '../components/modal';
import { EditListName } from '../compositions/edit-list-name';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { useApi } from '../hooks/use-api';
import { useRouting } from '../hooks/use-routing';
import { LearnItem, ListSummary } from '../models';
import { BatchImport } from './batch-import';

const DELETE_PROMPT = `Gib "JA" ein, um diese Liste unwiderruflich zu löschen.`;

type Props = {
  list: ListSummary;
  onListNameChanged: (name: string) => void;
  onItemsAdded: (newItems: LearnItem[]) => void;
};

export const ListSettings: FC<Props> = ({ list, onListNameChanged, onItemsAdded }) => {
  const [show, setShow] = useState(false);
  const { deleteList } = useApi();
  const { goToPage } = useRouting();

  const onListDeleted = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (prompt(DELETE_PROMPT) !== 'JA') {
      return;
    }

    try {
      await deleteList(list.id);
      goToPage('home'); // TODO
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        className="w-6 h-6 text-grey-75 hover:text-grey-50"
        onClick={() => setShow(true)}
      >
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

          <hr className="mb-4" />

          <h3>Import</h3>
          <p className="text-xs+">Übernimm Vokabellisten von anderswo.</p>
          <ul className="actual-list text-xs mb-4">
            <li>1 Eintrag pro Zeile</li>
            <li>
              Vokabel / Abfrage mit Tab{' '}
              <span className="border border-grey-50 rounded-sm px-2">⇥</span> trennen
            </li>
          </ul>

          <BatchImport listId={list.id} onBatchImportDone={onItemsAdded} />

          <hr className="mb-4" />

          <h3>Löschen</h3>
          <p className="mb-2 text-xs+">Du brauchst die Liste nicht mehr?</p>
          <Button onClick={onListDeleted} className="w-full" caution>
            <Icon type="delete" width="14px" /> Liste löschen
          </Button>
        </Modal>
      )}
    </div>
  );
};
