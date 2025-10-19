import { Modal } from '@/components/modal';
import { LearnItem } from '@/types/types';
import { FC } from 'react';
import { BatchImport } from './batch-import';

type Props = {
  listId: string;
  onClose: () => void;
  onItemsAdded?: (newItems: LearnItem[]) => void;
};

export const ImportPopup: FC<Props> = ({ listId, onItemsAdded, onClose }) => (
  <Modal title="Einträge importieren" onClose={onClose} width="lg">
    <p className="text-xs+">
      Du hast schon eine Liste mit Vokabeln? Super! Bring sie in dieses Format:
    </p>
    <ul className="actual-list text-xs mb-4">
      <li>Pro Zeile ein Eintrag</li>
      <li>
        Einträge = Vokabel <span className="border border-gray-50 rounded-sm px-1.5 mx-1">⇥</span>{' '}
        Abfrage
      </li>
    </ul>

    <BatchImport listId={listId} onBatchImportDone={onItemsAdded} />
  </Modal>
);
