import { FC } from 'react';
import { Modal } from '../components/modal';
import { LearnItem } from '../models';
import { BatchImport } from './batch-import';

type Props = {
  listId: string;
  onClose: () => void;
  onItemsAdded: (newItems: LearnItem[]) => void;
};

export const ImportPopup: FC<Props> = ({ listId, onItemsAdded, onClose }) => (
  <Modal title="Importieren" onClose={onClose} width="lg">
    <p className="text-xs+">Bestehende Listen übernehmen ist einfach:</p>
    <ul className="actual-list text-xs mb-4">
      <li>Pro Zeile ein Eintrag</li>
      <li>
        Eintrag = Vokabel / Tab <span className="border border-grey-50 rounded-sm px-2">⇥</span> /
        Abfrage
      </li>
    </ul>

    <BatchImport listId={listId} onBatchImportDone={onItemsAdded} />
  </Modal>
);
