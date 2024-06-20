'use client';

import { EditListName } from '@/compositions/edit-list-name';
import { removeList, setListSettings } from '@/db/actions';
import { Button } from '@/elements/button';
import { IconCrossThick } from '@/elements/icons/cross-thick';
import { RadioButton } from '@/elements/radio-button';
import { Switch } from '@/elements/switch';
import { TextField } from '@/elements/text-field';
import { List } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useState } from 'react';

const DELETE_PROMPT = `Gib "JA" ein, um diese Liste unwiderruflich zu löschen.`;

type Props = {
  list: List<'flaggedItems' | 'lastLearnt' | 'progress'>;
};

export const ListSettings: FC<Props> = ({ list }) => {
  const router = useRouter();

  const [count, setCount] = useState<'auto' | string>(
    list.learnCount ? `${list.learnCount}` : 'auto',
  );
  const changeCount = async (count: 'auto' | string) => {
    const countInt = parseInt(count);
    const amount = isNaN(countInt) ? 'auto' : Math.max(1, Math.min(countInt, 100));
    setCount(`${amount}`);
    setListSettings({ id: list.id, amount });
  };

  const [repeat, setRepeat] = useState(list.repeat);
  const toggleRepeat = async () => {
    setRepeat(!repeat);
    setListSettings({ id: list.id, repeat: !repeat });
  };

  return (
    <div className="mt-4 flex flex-col">
      <Section>
        <h2 className="mb-4">Lernen</h2>
        <SubSection title="Aufgabenanzahl">
          <div className="flex flex-col gap-3">
            <RadioButton
              checked={count === 'auto'}
              onCheck={() => changeCount('auto')}
              name="learn-item-count"
            >
              <strong>Automatische Portionierung</strong>
              <br />
              zwischen 10 und 15 Vokabeln
            </RadioButton>
            <span className="flex gap-4 items-center">
              <RadioButton
                checked={count !== 'auto'}
                onCheck={() => changeCount('10')}
                name="learn-item-count"
              >
                Anzahl festlegen:
              </RadioButton>
              <div className="w-24">
                <TextField
                  value={count}
                  onChange={(e) => changeCount(e.target.value)}
                  min={1}
                  max={100}
                  type="number"
                  width={150}
                />
              </div>
            </span>
          </div>
        </SubSection>

        <SubSection title="Repetieren">
          <div className="flex gap-4 justify-between items-center">
            <Switch enabled={!!repeat} onToggle={toggleRepeat} />
            Falsch beantwortete Vokabeln am Ende jeder Lerneinheit wiederholen
          </div>
        </SubSection>
      </Section>

      <Section>
        <h2 className="mb-4">Liste</h2>
        <SubSection title="Umbenennen">
          <EditListName currentName={list.name} listId={list.id} />
        </SubSection>

        <SubSection title="Löschen">
          <p className="mb-3 text-xs">Diese Liste und alle Inhalte unwider&shy;ruflich löschen</p>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              if (prompt(DELETE_PROMPT) === 'JA') {
                await removeList(list.id);
                router.push('/lists');
              }
            }}
            caution
            className="w-full max-w-72"
          >
            <IconCrossThick className="w-3.5" /> Liste löschen
          </Button>
        </SubSection>
      </Section>
    </div>
  );
};

const Section: FC<PropsWithChildren> = ({ children }) => (
  <section className="py-8">{children}</section>
);

const SubSection: FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => (
  <div className="flex max-sm:flex-col mt-8 first-of-type:mt-0">
    <span className="shrink-0 sm:w-48 font-massive text-gray-35 text-xs+ mb-4">{title}</span>
    <div>{children}</div>
  </div>
);
