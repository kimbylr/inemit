'use client';

import { getStatistics } from '@/db/helpers';
import { getExactPercentages } from '@/helpers/calculate-percentage';
import { classNames } from '@/helpers/class-names';
import { isWeekend } from '@/helpers/date';
import { percent, sum } from '@/helpers/math';
import { getColor } from '@/helpers/progress-mappers';
import { Stage } from '@/types/types';
import dayjs from 'dayjs';
import { FC, ReactNode } from 'react';

type Props = ReturnType<typeof getStatistics>;

export const Statistics: FC<Props> = ({ itemsPerStage, perDay, firstItemDate }) => {
  const perDayTotals = perDay.map(({ total }) => total);
  const perDayMaxCount = perDayTotals.reduce(
    (acc, cur) => Math.max(cur, acc),
    (perDayTotals[0] ?? 0) + (perDayTotals[1] ?? 0),
  );

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
        {[
          {
            description: 'Älteste Vokabel',
            content: dayjs(firstItemDate).format('D.M.YY'),
            marginBottom: true,
          },
          {
            description: 'Abfragen (gewertet)',
            content: new Intl.NumberFormat('de-CH').format(totalTries),
            marginBottom: false,
          },
          {
            description: 'Abfragen pro Vokabel Ø',
            content: Math.round(totalTries / itemsPerStage.total.length),
            marginBottom: false,
          },
          {
            description: 'Abfragen pro Tag Ø',
            content: Math.round(totalTries / dayjs(dayjs()).diff(firstItemDate, 'days')),
            marginBottom: true,
          },
          {
            description: 'Beherrschte (seltener als jährlich)',
            content: masteredCount,
            marginBottom: false,
          },
          {
            description: '% Beherrschte',
            content: percent(totalCount, masteredCount),
            marginBottom: true,
          },
        ].map((props) => (
          <StatsPair {...props} key={props.description} />
        ))}

        {Object.entries(itemsPerStage)
          .slice(0, 4)
          .map(([stage, progress]) => {
            const percentage =
              progress
                .map(({ timesCorrect, timesTotal }) => timesCorrect / timesTotal || 0)
                .reduce(sum, 0) / progress.length;

            return (
              <StatsPair
                description={`% korrekt (Fach ${stage})`}
                content={progress.length ? `${Math.round(100 * percentage)} %` : '-'}
                key={stage}
              />
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
        {fillEmptySlots(mergeDueAndDay1(perDay)).map(({ total, ...stages }, day) => {
          const baseWidth = total / perDayMaxCount;
          const date = dayjs().add(day + 1, 'days');

          return (
            <li key={day} className="w-full flex mb-0.5 h-5 text-xxs items-stretch">
              <span className={classNames('w-12 shrink-0 mr-0.5', isWeekend(date) && 'bg-gray-90')}>
                {date.format('D.M.')}
              </span>
              <span className="grow flex">
                {total === 0 ? (
                  <div className="px-0.5">0</div>
                ) : (
                  getExactPercentages(stages!).map(
                    (count, i) =>
                      count > 0 && (
                        <div
                          key={i}
                          className={classNames('bg-opacity-50 px-1 min-w-4', getColor(`${i + 1}`))}
                          style={{ width: baseWidth * count + '%', order: 4 - i }}
                        >
                          {stages[(i + 1) as Stage]}
                        </div>
                      ),
                  )
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

const mergeDueAndDay1 = ([due, day1, ...perDay]: Record<Stage | 'total', number>[]) => [
  {
    1: (due?.[1] ?? 0) + (day1?.[1] ?? 0),
    2: (due?.[2] ?? 0) + (day1?.[2] ?? 0),
    3: (due?.[3] ?? 0) + (day1?.[3] ?? 0),
    4: (due?.[4] ?? 0) + (day1?.[4] ?? 0),
    total: (due?.total ?? 0) + (day1?.total ?? 0),
  },
  ...perDay,
];

const fillEmptySlots = (days: Record<Stage | 'total', number>[]) => {
  for (let index = 0; index < days.length; index++) {
    if (!days[index]) {
      days[index] = { total: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    }
  }
  return days;
};

const StatsPair: FC<{ description: string; content: ReactNode; marginBottom?: boolean }> = ({
  description,
  content,
  marginBottom,
}) => (
  <>
    <dt>{description}:</dt>
    <dd className={classNames('text-right', marginBottom && 'mb-4')}>{content}</dd>
  </>
);
