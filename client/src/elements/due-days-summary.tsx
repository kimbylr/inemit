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
        Im Moment gibt's <strong>nichts zu lernen</strong> 😎 Schau übermorgen
        nochmals vorbei, dann
        {dueIn2Days === 1
          ? ` ist 1 Vokabel dran.`
          : ` sind ${dueIn2Days} Vokabeln dran.`}
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
