import { FC, useEffect, useState } from 'react';
import { Modal } from '../components/modal';
import { Icon } from '../elements/icon';
import { RadioButton } from '../elements/radio-button';
import { Switch } from '../elements/switch';
import { TextField } from '../elements/text-field';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { ListWithProgress } from '../models';

type Props = {
  list: ListWithProgress;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const LearnSettings: FC<Props> = ({ list, open, setOpen }) => {
  const [count, setCount] = useState<'auto' | string>(
    list.learnCount ? `${list.learnCount}` : 'auto',
  );
  const [repeat, setRepeat] = useState(list.repeat);
  const { editListSettings } = useApi();
  const { updateList } = useLists();

  return (
    <div>
      <button className="w-6 h-6 text-grey-75 hover:text-grey-50" onClick={() => setOpen(true)}>
        <Icon type="settings" />
      </button>

      {open && (
        <Modal
          title="Lernen"
          onClose={() => {
            updateList({ ...list, repeat });
            const amount = isNaN(parseInt(count))
              ? 'auto'
              : Math.max(1, Math.min(parseInt(count), 100));
            setCount(`${amount}`);
            editListSettings({ listId: list.id, amount, repeat });
            setOpen(false);
          }}
        >
          <section>
            <h3 className="mb-4">Abfragen pro Lerneinheit</h3>
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
                  onCheck={() => setCount('10')}
                  name="learn-item-count"
                >
                  Anzahl festlegen:
                </RadioButton>
                <div className="w-24">
                  <TextField
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min={1}
                    max={100}
                    type="number"
                    width={150}
                  />
                </div>
              </span>
            </div>
          </section>

          <hr className="mb-4 -mx-8" />

          <section>
            <div className="flex gap-4 justify-between items-center">
              <h3>Repetieren</h3>
              <Switch enabled={repeat} onToggle={() => setRepeat((r) => !r)} />
            </div>
            <p className="text-xs mt-2">
              Falsch beantwortete Vokabeln am Ende jeder Lerneinheit wiederholen
            </p>
          </section>
        </Modal>
      )}
    </div>
  );
};
