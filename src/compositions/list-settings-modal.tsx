'use client';

import { removeList } from '@/db/actions';
import { Button } from '@/elements/button';
import { IconCrossThick } from '@/elements/icons/cross-thick';
import { IconSettings } from '@/elements/icons/settings';
import { useRouter } from 'next/navigation';
import { FC, ReactNode, useState } from 'react';
import { Modal } from '../components/modal';
import { EditListName } from './edit-list-name';

const DELETE_PROMPT = `Gib "JA" ein, um diese Liste unwiderruflich zu löschen.`;

type Props = {
  list: { id: string; name: string };
  toggleIcon?: ReactNode;
};

export const ListSettingsModal: FC<Props> = ({ list, toggleIcon: ToggleIcon }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center">
      <button
        onClick={() => setShow(true)}
        aria-label="Liste bearbeiten"
        className="outline-none group"
      >
        {ToggleIcon || <IconSettings className="w-6 h-6 text-gray-75 hover:text-gray-50" />}
      </button>

      {show && (
        <Modal title="Einstellungen" onClose={() => setShow(false)}>
          <h2 className="">Umbenennen</h2>
          <p className="mb-4 text-xs+">Zeit für einen neuen Namen?</p>
          <EditListName currentName={list.name} listId={list.id} />

          <hr className="mb-4 -mx-8" />

          <h2>Löschen</h2>
          <p className="mb-3 text-xs+">Diese Liste und alle Inhalte unwider&shy;ruflich löschen</p>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              if (prompt(DELETE_PROMPT) !== 'JA') return;
              await removeList(list.id);
              router.push('/lists');
            }}
            caution
            className="w-full"
          >
            <IconCrossThick className="w-3.5" /> Liste löschen
          </Button>
        </Modal>
      )}
    </div>
  );
};
