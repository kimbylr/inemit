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
import { getExactPercentages } from '@/helpers/calculate-percentage';
import { classNames } from '@/helpers/class-names';
import { isWeekend } from '@/helpers/date';
import { percent, sum } from '@/helpers/math';
import { getColor } from '@/helpers/progress-mappers';
import { List, Stage } from '@/types/types';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

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

  const { dueToday, stages } = list.progress;

  return (
    <>
      {list.itemsCount > 0 && (
        <>
          <div className="mt-8 hidden xs:block">
            <ListProgress stages={stages} modes={['legend', 'count', 'percentage']} />
          </div>

          <div className="mt-4 xs:hidden">
            <ExpandableArea teaser={<ProgressPie stages={stages} />} showChevronButton={false}>
              <div className="pt-2">
                <ListProgress stages={stages} modes={['count', 'percentage']} />
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
        {!expanded && <LinkButton onClick={() => setExpanded(true)}>Mehr…</LinkButton>}
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

const Statistics = ({ itemsPerStage, perDay, firstItemDate }: ReturnType<typeof getStatistics>) => {
  const perDayTotals = perDay.map(({ total }) => total);
  const dueUntilTomorrow = perDayTotals[0] + perDayTotals[1];
  const perDayMaxCount = perDayTotals.reduce((acc, cur) => Math.max(cur, acc), dueUntilTomorrow);

  const totalTries = itemsPerStage.total.map(({ timesTotal }) => timesTotal).reduce(sum, 0);
  const totalCount = itemsPerStage.total.length;
  const masteredCount = itemsPerStage.total.filter(({ interval }) => interval > 365).length;
  const withinYearCount = itemsPerStage.total.filter(({ due }) =>
    dayjs(due).isBefore(dayjs().add(1, 'year')),
  ).length;

  return (
    <section className="mt-8">
      <h2 className="mb-2">Statistik</h2>
      <dl className="grid grid-cols-[1fr,4rem] gap-1 text-xs+ max-w-sm">
        <dt>Älteste Vokabel:</dt>
        <dd className="mb-4 text-right">{dayjs(firstItemDate).format('D.M.YY')}</dd>
        <dt>Abfragen (gewertet):</dt>
        <dd className="text-right">{new Intl.NumberFormat('de-CH').format(totalTries)}</dd>
        <dt>Abfragen pro Vokabel Ø:</dt>
        <dd className="mb-4 text-right">{Math.round(totalTries / itemsPerStage.total.length)}</dd>
        <dt>Beherrschte (seltener als jährlich):</dt>
        <dd className="text-right">{masteredCount}</dd>
        <dt>% Beherrschte:</dt>
        <dd className="mb-4 text-right">{percent(totalCount, masteredCount)}</dd>

        {Object.entries(itemsPerStage)
          .slice(0, 4)
          .map(([stage, progress]) => {
            const percentage =
              progress
                .map(({ timesCorrect, timesTotal }) => timesCorrect / timesTotal || 0)
                .reduce(sum, 0) / progress.length;

            return (
              <React.Fragment key={stage}>
                <dt>% korrekt (Fach {stage}):</dt>
                <dd className="text-right">{Math.round(100 * percentage)} %</dd>
              </React.Fragment>
            );
          })}
      </dl>

      <h2 className="mt-8 mb-2">Ausblick</h2>
      <p className="mb-[0.75em] text-xs+">
        Diese Woche sind <strong>{perDayTotals.slice(0, 7).reduce(sum, 0)} Vokabeln</strong>{' '}
        eingeplant, im ganzen Monat <strong>{perDayTotals.reduce(sum, 0)} Vokabeln</strong>, bis in
        einem Jahr <strong>{withinYearCount} Vokabeln</strong>.
      </p>
      <ol>
        {perDay.map(({ total, ...stages }, day, [due]) => {
          if (day === 0) {
            return null;
          }

          if (day === 1) {
            stages[1] += due[1];
            stages[2] += due[2];
            stages[3] += due[3];
            stages[4] += due[4];
            total = Object.values(stages).reduce(sum, 0);
          }

          const baseWidth = total / perDayMaxCount;
          const date = dayjs().add(day, 'days');

          return (
            <li key={day} className="w-full flex mb-0.5 h-5 text-xxs items-stretch">
              <span className={classNames('w-12 shrink-0 mr-0.5', isWeekend(date) && 'bg-gray-90')}>
                {date.format('D.M.')}
              </span>
              <span className="grow flex">
                {getExactPercentages(stages).map(
                  (count, i) =>
                    count > 0 && (
                      <div
                        key={i}
                        className={classNames('bg-opacity-50 px-1 min-w-4', getColor(`${i + 1}`))}
                        style={{ width: baseWidth * count + '%' }}
                      >
                        {stages[(i + 1) as Stage]}
                      </div>
                    ),
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
