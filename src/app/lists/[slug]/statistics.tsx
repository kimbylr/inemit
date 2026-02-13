'use client';

import { getStatistics } from '@/db/helpers';
import { getExactPercentages } from '@/helpers/calculate-percentage';
import { classNames } from '@/helpers/class-names';
import { isWeekend } from '@/helpers/date';
import { formatLargeNumber, percent, sum } from '@/helpers/math';
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
  const totalTriesCorrect = itemsPerStage.total
    .map(({ timesCorrect }) => timesCorrect)
    .reduce(sum, 0);
  const totalTriesWrong = itemsPerStage.total.map(({ timesWrong }) => timesWrong).reduce(sum, 0);

  const totalCount = itemsPerStage.total.length;
  const masteredCount = itemsPerStage.total.filter(({ interval }) => interval > 365).length;
  const withinYearCount = itemsPerStage.total.filter(({ due }) =>
    dayjs(due).isBefore(dayjs().add(1, 'year')),
  ).length;

  return (
    <section className="mt-8">
      <h2 className="mb-2">Statistik</h2>
      <p>
        Die erste Vokabel wurde am <strong>{dayjs(firstItemDate).format('D.M.YYYY')}</strong>{' '}
        erfasst – also{' '}
        <strong className="text-gray-50">vor {dayjs().diff(firstItemDate, 'days')} Tagen</strong>.
      </p>
      <p className="mt-[1em]">
        Seit da wurden <strong>{formatLargeNumber(totalTries)} Vokabeln abgefragt</strong> (ohne
        ungewertete Wiederholungen), das sind durchschnittlich{' '}
        <strong className="text-gray-50">
          {Math.round(totalTries / dayjs().diff(firstItemDate, 'days'))} pro Tag
        </strong>{' '}
        bzw.{' '}
        <strong className="text-gray-50">
          {Math.round(totalTries / itemsPerStage.total.length)} pro Vokabel
        </strong>
        .{' '}
        <strong className="text-primary-150">
          {formatLargeNumber(totalTriesCorrect)} Mal ({percent(totalTries, totalTriesCorrect)})
        </strong>{' '}
        hast du richtig geantwortet,{' '}
        <strong className="text-negative-150">
          {formatLargeNumber(totalTriesWrong)} Mal ({percent(totalTries, totalTriesWrong)})
        </strong>{' '}
        falsch.
      </p>
      <p className="mt-[1em]">
        <strong className="bg-[repeating-linear-gradient(-40deg,#0E7054,#0E7054_2px,#00A878_2px,#00A878_6px)] bg-clip-text text-transparent">
          {masteredCount} Vokabeln ({percent(totalCount, masteredCount)})
        </strong>{' '}
        beherrschst du so gut, dass sie seltener als einmal pro Jahr abgefragt werden 💪
      </p>

      <h2 className="mt-8 mb-2">Ausblick</h2>
      <p className="mb-[0.75em] text-xs+">
        Bis in einer Woche sind <strong>{perDayTotals.slice(0, 7).reduce(sum, 0)} Vokabeln</strong>{' '}
        eingeplant, bis in einem Monat <strong>{perDayTotals.reduce(sum, 0)} Vokabeln</strong> und
        bis in einem Jahr <strong>{withinYearCount} Vokabeln</strong>.
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
