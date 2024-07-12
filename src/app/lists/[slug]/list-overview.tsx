'use client';

import { ExpandableArea } from '@/components/expandable-area';
import { ProgressBar } from '@/components/progress-bar';
import { ProgressPie } from '@/components/progress-pie';
import { EditableItemsList } from '@/compositions/editable-items-list';
import { Button } from '@/elements/button';
import { DueDaysSummary } from '@/elements/due-days-summary';
import { IconFlag } from '@/elements/icons/flag';
import { IconLogo } from '@/elements/icons/logo';
import { List } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';

type Props = {
  list: List<'flaggedItems' | 'lastLearnt' | 'progress'>;
};

export const ListOverview: FC<Props> = ({ list }) => {
  const learnButtonRef = useRef<HTMLButtonElement>(null);
  const [flaggedItems] = useState(list.flaggedItems); // kept "stale" on purpose
  const router = useRouter();

  // Manage focus (tab when nothing in focus => learn)
  useEffect(() => {
    if (!learnButtonRef.current) {
      return;
    }

    const onTabListener = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }

      if (document.activeElement === null || document.activeElement.nodeName === 'BODY') {
        // wait a tick (so that browser handles tab first)
        requestAnimationFrame(() => learnButtonRef.current?.focus());
      }
    };

    document.addEventListener('keydown', onTabListener);
    return () => document.removeEventListener('keydown', onTabListener);
  }, [list?.id]);

  const { dueToday, dueTomorrow, stages } = list.progress;

  return (
    <>
      {list.itemsCount > 0 && (
        <>
          <div className="mt-8 hidden xs:block">
            <ProgressBar stages={stages} showCountOnClick />
          </div>

          <div className="mt-4 xs:hidden">
            <ExpandableArea teaser={<ProgressPie stages={stages} />} showChevronButton={false}>
              <div className="pt-2">
                <ProgressBar stages={stages} showCountPerStage />
              </div>
            </ExpandableArea>
          </div>
        </>
      )}

      <p className="spaced">
        In dieser Liste {list.itemsCount === 1 ? 'befindet' : 'befinden'} sich{' '}
        <strong>
          {list.itemsCount} {list.itemsCount === 1 ? 'Vokabel' : 'Vokabeln'}
        </strong>
        . <DueDaysSummary dueToday={dueToday} dueTomorrow={dueTomorrow} />
      </p>

      <div className="flex gap-3 flex-col items-stretch xxs:flex-row">
        {dueToday > 0 && (
          <Button
            type="button"
            primary
            onClick={() => router.push(`${list.slug}/learn`)}
            ref={learnButtonRef}
          >
            <IconLogo className="w-5" />
            Jetzt lernen!
          </Button>
        )}
      </div>

      {flaggedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="flex gap-3 items-center">
            Markiert
            <IconFlag className="h-4" />
          </h2>
          <EditableItemsList listId={list.id} canAdd={false} items={flaggedItems} />
        </div>
      )}

      <div className="mt-12">
        <h2>Hinzufügen</h2>
        <EditableItemsList listId={list.id} />
      </div>
    </>
  );
};
