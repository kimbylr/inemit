import React, { FC } from 'react';

interface Props {
  dueToday: number;
  dueTomorrow: number;
}
export const DueDaysSummary: FC<Props> = ({ dueToday, dueTomorrow }) => {
  if (dueToday) {
    return (
      <>
        Davon {dueToday === 1 ? 'steht' : 'stehen'} <strong>{dueToday}</strong>{' '}
        zum Lernen an.
      </>
    );
  }

  if (dueTomorrow) {
    return (
      <>
        Im Moment gibt's <strong>nichts zu lernen</strong> 😎 Schau morgen
        nochmals vorbei, dann
        {dueTomorrow === 1
          ? ` ist 1 Vokabel dran.`
          : ` sind ${dueTomorrow} Vokabeln dran.`}
      </>
    );
  }

  return null;
};
