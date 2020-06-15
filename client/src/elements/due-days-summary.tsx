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

  if (dueIn2Days) {
    return (
      <>
        Im Moment gibt's <strong>nichts zu lernen</strong> 😎 Schau{' '}
        <strong>übermorgen</strong> nochmals vorbei (voraussichtlich{' '}
        {dueIn2Days === 1 ? `1 Vokabel` : `${dueIn2Days} Vokabeln`} zu lernen)
      </>
    );
  }

  if (dueIn7Days) {
    return (
      <>
        Im Moment gibt's <strong>nichts zu lernen</strong> 🎉 Schau in einigen
        Tagen wieder vorbei.
      </>
    );
  }

  return null;
};
