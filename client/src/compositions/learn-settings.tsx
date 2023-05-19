import { FC, useState } from 'react';
import { Modal } from '../components/modal';
import { EditListName } from '../compositions/edit-list-name';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { RadioButton } from '../elements/radio-button';
import { useApi } from '../hooks/use-api';
import { ListSummary } from '../models';
import { useLists } from '../hooks/use-lists';
import { TextField } from '../elements/text-field';

type Props = {
  list: ListSummary;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const LearnSettings: FC<Props> = ({ list, open, setOpen }) => {
  const [count, setCount] = useState<'auto' | number>(list.learnCount || 'auto');
  const { editListLearnAmount } = useApi();

  return (
    <div>
      <button
        className="w-6 h-6 text-grey-75 hover:text-grey-50"
        onClick={() => setOpen(true)}
      >
        <Icon type="settings" />
      </button>

      {open && (
        <Modal
          title="Lernen"
          onClose={() => {
            editListLearnAmount({ listId: list.id, amount: count });
            setOpen(false);
          }}
        >
          <h3>Anzahl Vokabeln</h3>
          <p className="mb-4 text-xs+">Wie viele Wörter sollen abgefragt werden?</p>
          <div className="flex flex-col gap-3">
            <RadioButton
              checked={count === 'auto'}
              onCheck={() => setCount('auto')}
              name="learn-item-count"
            >
              <strong>Automatische Portionierung</strong>
              <br />
              zwischen 10 und 15 Vokabeln
            </RadioButton>
            <span className="flex gap-4 items-center">
              <RadioButton
                checked={count !== 'auto'}
                onCheck={() => setCount(10)}
                name="learn-item-count"
              >
                individuell:
              </RadioButton>
              <TextField
                value={count}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value);
                  if (isNaN(parsed)) return setCount(1);
                  setCount(Math.max(1, Math.min(parsed, 100)));
                }}
                min={1}
                max={100}
                type="number"
              />
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
};
