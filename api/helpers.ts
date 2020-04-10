import * as dayjs from 'dayjs';
import { LearnItemType, ListType } from './models';

export const getProgressSummary = (items: LearnItemType[]) => {
  const stages = items.reduce(
    (acc, { progress: { stage } }) => ({
      ...acc,
      [stage]: acc[stage] + 1,
    }),
    { 1: 0, 2: 0, 3: 0, 4: 0 },
  );

  const dayIntervals = [0, 2, 7, 14, 30];
  const intervalObj = { more: 0 };
  dayIntervals.forEach((i) => (intervalObj[i] = 0));
  const dueBeforeDays = items.reduce((acc, { progress: { due } }) => {
    const dueIn = dayIntervals.find((interval) =>
      dayjs(due).isBefore(dayjs().add(interval, 'day')),
    );

    return typeof dueIn === 'number'
      ? { ...acc, [dueIn]: (acc[dueIn] || 0) + 1 }
      : { ...acc, more: acc.more + 1 };
  }, intervalObj);

  return { stages, dueBeforeDays };
};

export const mapList = (
  { _id, name, slug, created, updated, items }: ListType,
  includeItems = false,
) => ({
  id: _id,
  name,
  slug,
  created,
  updated,
  itemsCount: items.length,
  items: includeItems ? items.map((item) => mapItem(item, true)) : undefined,
});

export const mapItem = (
  { _id, created, updated, prompt, solution, progress }: LearnItemType,
  includeProgress = false,
) => {
  return {
    id: _id,
    created,
    updated,
    prompt,
    solution,
    progress: includeProgress ? progress : undefined,
  };
};

export const mapItems = (items: LearnItemType[], includeProgress = false) =>
  items.map((item) => mapItem(item, includeProgress));

// "SuperMemo 2.0" algorithm: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
export const recalcEasiness = (easiness: number, answerQuality: number) => {
  const newEasiness =
    easiness +
    (0.1 - (5 - answerQuality) * (0.08 + (5 - answerQuality) * 0.02));

  if (newEasiness < 1.3) {
    return 1.3;
  }

  if (newEasiness > 2.5) {
    return 2.5;
  }

  return newEasiness;
};

export const recalcInterval = (
  interval: number,
  easiness: number,
  correct: boolean,
) => (correct ? (interval === 1 ? 6 : interval * easiness) : 1);
