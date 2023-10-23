'use client';

import { Modal } from '@/components/modal';
import { setListSettings } from '@/db/actions';
import { IconSettings } from '@/elements/icons/settings';
import { RadioButton } from '@/elements/radio-button';
import { Switch } from '@/elements/switch';
import { TextField } from '@/elements/text-field';
import { List } from '@/types/types';
import { FC, useState } from 'react';

type Props = {
  list: List;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const LearnSettings: FC<Props> = ({ list }) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<'auto' | string>(
    list.learnCount ? `${list.learnCount}` : 'auto',
  );
  const [repeat, setRepeat] = useState(list.repeat);

  return (
    <div>
      <button
        className="w-6 h-6 text-grey-75 hover:text-grey-50 dotted-focus dotted-focus-dark"
        onClick={() => setOpen(true)}
      >
        <IconSettings />
      </button>

      {open && (
        <Modal
          title="Lernen"
          onClose={() => {
            const countInt = parseInt(count);
            const amount = isNaN(countInt) ? 'auto' : Math.max(1, Math.min(countInt, 100));
            setCount(`${amount}`);
            setOpen(false);
            setListSettings({ id: list.id, amount, repeat });
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
              <Switch enabled={!!repeat} onToggle={() => setRepeat((r) => !r)} />
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
