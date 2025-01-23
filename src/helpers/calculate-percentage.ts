import { ListProgressSummary } from '@/types/types';

export const getPercentages = (stages: ListProgressSummary) => {
  const divisor = Object.values(stages).reduce((sum, count) => sum + count, 0) / 100;

  const entries = Object.entries(stages)
    .map(([stage, count]) => {
      const percentage = count / divisor;

      return {
        stage,
        percentage: Math.floor(percentage),
        offset: percentage % 1,
        count,
      };
    })
    .toSorted((a, b) => b.offset - a.offset);

  // distribute remainder to entries with biggest offset from rounding
  const remainder = Math.round(entries.reduce((sum, { offset }) => sum + offset, 0));

  for (let i = 0; i < remainder; i++) {
    entries[i].percentage++;
  }

  return entries.reduce<ListProgressSummary>(
    (acc, { stage, percentage, count }) => ({
      ...acc,
      [stage]: `${percentage < 1 && count > 0 ? '< 1' : percentage} %`,
    }),
    {} as any,
  );
};
