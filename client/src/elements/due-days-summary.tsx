import React, { FC } from 'react';
import { ProgressSummaryDue } from '../models';

export const DueDaysSummary: FC<{ dueBeforeDays: ProgressSummaryDue }> = ({
  dueBeforeDays: { 0: dueToday, 2: dueIn2Days, 7: dueIn7Days },
}) => {
  if (dueToday) {
    return (
      <>
        Davon {dueToday === 1 ? 'steht' : 'stehen'} <strong>{dueToday}</strong>{' '}
        zum Lernen an.
      </>
    );
  }

  if (dueIn2Days > dueIn7Days / 2) {
    return (
      <>
        Im Moment gibt's nichts zu lernen. Bis übermorgen{' '}
        {dueIn2Days === 1 ? `wird 1 Vokabel` : `werden ${dueIn2Days} Vokabeln`}{' '}
        fällig.
      </>
    );
  }

  if (dueIn7Days) {
    return (
      <>
        Im Moment gibt's nichts zu lernen. Bis in einer Woche{' '}
        {dueIn7Days === 1 ? `wird 1 Vokabel` : `werden ${dueIn7Days} Vokabeln`}{' '}
        fällig.
      </>
    );
  }

  return null;
};
