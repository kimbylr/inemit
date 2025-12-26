'use client';

import { getStatistics } from '@/db/helpers';
import { getExactPercentages } from '@/helpers/calculate-percentage';
import { classNames } from '@/helpers/class-names';
import { isWeekend } from '@/helpers/date';
import { percent, sum } from '@/helpers/math';
import { getColor } from '@/helpers/progress-mappers';
import { Stage } from '@/types/types';
import dayjs from 'dayjs';
import React, { FC } from 'react';

type Props = ReturnType<typeof getStatistics>;

export const Statistics: FC<Props> = ({ itemsPerStage, perDay, firstItemDate }) => {
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
