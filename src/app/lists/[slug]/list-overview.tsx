'use client';

import { ExpandableArea } from '@/components/expandable-area';
import { ListProgress } from '@/components/list-progress';
import { ProgressPie } from '@/components/progress-pie';
import { EditableItemsList } from '@/compositions/editable-items-list';
import { getListStatistics } from '@/db/actions';
import { getStatistics } from '@/db/helpers';
import { Button } from '@/elements/button';
import { DueDaysSummary } from '@/elements/due-days-summary';
import { IconFlag } from '@/elements/icons/flag';
import { IconLogo } from '@/elements/icons/logo';
import { LinkButton } from '@/elements/link-button';
import { Spinner } from '@/elements/spinner';
import { List } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Statistics } from './statistics';

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

  const { dueToday, stages, mastered } = list.progress;

  return (
    <>
      {list.itemsCount > 0 && (
        <>
          <div className="mt-8 hidden xs:block">
            <ListProgress
              stages={stages}
              mastered={mastered}
              modes={['legend', 'count', 'percentage']}
            />
          </div>

          <div className="mt-4 xs:hidden">
            <ExpandableArea teaser={<ProgressPie stages={stages} />} showChevronButton={false}>
              <div className="pt-2">
                <ListProgress stages={stages} mastered={mastered} modes={['count', 'percentage']} />
              </div>
            </ExpandableArea>
          </div>
        </>
      )}

      <StatisticsWrapper list={list}>
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
      </StatisticsWrapper>

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

const StatisticsWrapper: FC<PropsWithChildren<Props>> = ({ list, children: learnButton }) => {
  const [data, setData] = useState<ReturnType<typeof getStatistics> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { dueToday, dueTomorrow } = list.progress;

  useEffect(() => {
    if (expanded && !data) getListStatistics(list.id).then(setData);
  }, [expanded, list.id, data]);

  return (
    <section>
      <p className="spaced">
        In dieser Liste {list.itemsCount === 1 ? 'befindet' : 'befinden'} sich{' '}
        <strong>
          {list.itemsCount} {list.itemsCount === 1 ? 'Vokabel' : 'Vokabeln'}
        </strong>
        . <DueDaysSummary dueToday={dueToday} dueTomorrow={dueTomorrow} />{' '}
        {!expanded && list.itemsCount > 0 && (
          <LinkButton onClick={() => setExpanded(true)}>Mehr…</LinkButton>
        )}
        {expanded && !data && (
          <span className="inline-flex relative pl-1.5 top-0.5">
            <Spinner size="xs" padding={false} />
          </span>
        )}
      </p>

      {learnButton}

      {expanded && data && <Statistics {...data} />}
    </section>
  );
};
