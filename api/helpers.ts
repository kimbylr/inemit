import * as dayjs from 'dayjs';
import { LearnItemType, ListType, Progress } from './models';

export const getUserId = (req: any): string | null => req?.user?.sub ?? null;

export const getProgressSummary = (items: LearnItemType[]) => {
  const stages = items.reduce(
    (acc, { progress: { stage } }) => ({
      ...acc,
      [stage]: acc[stage] + 1,
    }),
    { 1: 0, 2: 0, 3: 0, 4: 0 },
  );

  const due = items.reduce(
    (acc, { progress: { due } }) => {
      if (dayjs(due).isBefore(dayjs())) {
        return { ...acc, dueToday: acc.dueToday + 1 };
      }

      if (dayjs(due).isBefore(dayjs().add(1, 'day'))) {
        return { ...acc, dueTomorrow: acc.dueTomorrow + 1 };
      }

      return acc;
    },
    { dueToday: 0, dueTomorrow: 0 },
  );

  return { stages, ...due };
};

const getLastLearnt = (items: LearnItemType[]) =>
  items.sort(
    ({ progress: { updated: a } }, { progress: { updated: b } }) =>
      b.getTime() - a.getTime(),
  )[0]?.progress.updated ?? new Date(0);

export interface IncludeOptions {
  items?: boolean;
  flaggedItems?: boolean;
  lastLearnt?: boolean;
}
export const mapList = (
  { _id, name, slug, created, updated, items, learnCount }: ListType,
  options?: IncludeOptions,
) => ({
  id: _id,
  name,
  slug,
  created,
  updated,
  learnCount,
  itemsCount: items.length,
  items: options?.items ? items.map((item) => mapItem(item, true)) : undefined,
  flaggedItems: options?.flaggedItems
    ? items.filter(({ flagged }) => flagged).map((item) => mapItem(item, true))
    : undefined,
  lastLearnt: options?.lastLearnt ? getLastLearnt(items) : undefined,
});

export const mapItem = (
  { _id, created, updated, prompt, solution, flagged, image, progress }: LearnItemType,
  includeProgress = false,
) => {
  return {
    id: _id,
    created,
    updated,
    prompt,
    solution,
    flagged,
    image,
    progress: includeProgress ? progress : undefined,
  };
};

export const mapItems = (items: LearnItemType[], includeProgress = false) =>
  items.map((item) => mapItem(item, includeProgress));

// "SuperMemo 2.0" algorithm: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
export const recalcEasiness = (easiness: number, answerQuality: number) => {
  const newEasiness =
    easiness + (0.1 - (5 - answerQuality) * (0.08 + (5 - answerQuality) * 0.02));

  if (newEasiness < 1.3) {
    return 1.3;
  }

  if (newEasiness > 2.5) {
    return 2.5;
  }

  return newEasiness;
};

export const recalcInterval = (interval: number, easiness: number, correct: boolean) =>
  correct ? (interval === 1 ? 6 : interval * easiness) : 1;

export const getDue = (interval: number, blur = 0.2) => {
  // next due is not set to _exactly_ x days for 2 reasons:
  // - learning a big batch would result in another spike in 1/6/... days
  // - shuffling (same order tends to be internalised; successive voc. can be related)
  const randomOffset = Math.random() * blur * 2 - blur;

  return dayjs()
    .add(interval, 'day')
    .add(randomOffset * interval * 24 * 60, 'minute')
    .toDate();
};

export const getInitialProgress = (stage: any) => {
  const stages = {
    2: { stage: 2, interval: 6 },
    3: { stage: 3, interval: 15 },
  };

  return new Progress({ due: getDue(1), ...(stages[stage] || {}) });
};

export const getLearnCount = (total: number) => {
  if (total <= 15) return total;
  if (total <= 30) return Math.ceil(total / 2);

  const chunks = Math.round(total / 12);
  return Math.ceil(total / chunks);
};
