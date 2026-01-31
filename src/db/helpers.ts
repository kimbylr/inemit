import {
  IncludeListOptions,
  ISODate,
  LearnItem,
  LearnItemProgress,
  LearnItemWithProgress,
  MappedList,
  Stage,
  StatisticsItemProgress,
} from '@/types/types';
import dayjs from 'dayjs';
import { LearnItemType, ListType, Progress } from './models';

export const getProgressSummary = (items: LearnItemType[]) => {
  const stages = items.reduce(
    (acc, { progress: { stage } }) => ({
      ...acc,
      [stage]: acc[stage as 1 | 2 | 3 | 4] + 1,
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

  const mastered = items.filter(({ progress: { interval } }) => interval > 365).length;

  return { stages, ...due, mastered };
};

export const getStatistics = (
  items: {
    created: Date | ISODate;
    progress: Omit<LearnItemProgress, 'due' | 'updated'> & {
      _id?: any;
      updated?: any;
      due: Date | ISODate;
    };
  }[],
) => {
  const itemsPerStage = items.reduce<Record<Stage | 'total', StatisticsItemProgress[]>>(
    (acc, { progress: { _id, updated, due, ...rest } }) => {
      const progress = {
        ...rest,
        due: due as ISODate,
        timesTotal: rest.timesCorrect + rest.timesWrong,
      };
      return {
        ...acc,
        [progress.stage]: [...acc[progress.stage], progress],
        total: [...acc.total, progress],
      };
    },
    { 1: [], 2: [], 3: [], 4: [], total: [] },
  );

  const yesterday = dayjs().subtract(1, 'day');
  const perDay = Object.values(itemsPerStage.total)
    .filter(({ due }) => dayjs(due).isBefore(dayjs().add(30, 'days')))
    .reduce(
      (acc, cur) => {
        const daysFromToday = Math.max(dayjs(cur.due).diff(yesterday, 'day'), 0);
        const stages = acc[daysFromToday] ?? { 1: 0, 2: 0, 3: 0, 4: 0, total: 0 };
        stages[cur.stage]++;
        stages.total++;
        acc[daysFromToday] = stages;

        return acc;
      },
      [] as Record<Stage | 'total', number>[], // those in [0] are same as due
    );

  const firstItemDate = items
    .map(({ created }) => created)
    .toSorted((a, b) => dayjs(a).unix() - dayjs(b).unix())
    .at(0);

  return { itemsPerStage, perDay, firstItemDate };
};

const getLastLearnt = (items: LearnItemType[]) =>
  items.sort(
    ({ progress: { updated: a } }, { progress: { updated: b } }) => b.getTime() - a.getTime(),
  )[0]?.progress.updated ?? new Date(0);

export const mapList = <T extends IncludeListOptions>(
  { _id, name, slug, created, updated, items, learnCount, repeat }: ListType,
  options: Partial<T> = {},
): MappedList<T> =>
  ({
    id: _id.toString(),
    name,
    slug,
    created,
    updated,
    learnCount,
    repeat,
    itemsCount: items.length,
    progress: options.progress ? getProgressSummary(items) : undefined,
    items: options.items ? items.map((item) => mapItem(item, true)) : undefined,
    flaggedItems: options.flaggedItems
      ? items.filter(({ flagged }) => flagged).map((item) => mapItem(item, true))
      : undefined,
    lastLearnt: options.lastLearnt ? getLastLearnt(items) : undefined,
  }) as any;

export const mapItem = (
  {
    _id,
    created,
    updated,
    prompt,
    promptAddition,
    solution,
    flagged,
    image,
    progress,
  }: LearnItemType,
  includeProgress = false,
): typeof includeProgress extends true ? LearnItemWithProgress : LearnItem =>
  ({
    id: _id.toString(),
    created,
    updated,
    prompt,
    promptAddition,
    solution,
    flagged,
    image: (image && normaliseId(image)) || undefined,
    progress: includeProgress ? normaliseId(progress) : undefined,
  }) as any;

const normaliseId = ({ _id, ...rest }: object & { _id?: String }) => ({
  id: _id?.toString(),
  ...rest,
});

export const mapItems = (items: LearnItemType[], includeProgress = false) =>
  items.map((item) => mapItem(item, includeProgress));

// "SuperMemo 2.0" algorithm: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
export const recalcEasiness = (easiness: number, answerQuality: number) => {
  const newEasiness = easiness + (0.1 - (5 - answerQuality) * (0.08 + (5 - answerQuality) * 0.02));

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

export const getInitialProgress = (stage: 1 | 2 | 3 = 1) => {
  const stages = {
    1: {},
    2: { stage: 2, interval: 6 },
    3: { stage: 3, interval: 15 },
  };

  return new Progress({ due: getDue(1), ...stages[stage] });
};

export const getLearnCount = (total: number) => {
  const chunks = Math.ceil(total / 15);
  return Math.ceil(total / chunks);
};

export const sortByLastLearnt = <T extends { lastLearnt?: Date }>(lists: T[]) =>
  lists.sort(
    ({ lastLearnt: a }, { lastLearnt: b }) =>
      new Date(b || '').getTime() - new Date(a || '').getTime(),
  );
