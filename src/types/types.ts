import { getProgressSummary, mapItem } from '@/db/helpers';

export type ISODate = string; // e.g. "2020-02-22T17:34:46.822Z"

export type Stage = 1 | 2 | 3 | 4;

export type ListProgressSummary = Record<Stage, number>;

export type UnsplashImage = {
  id: string;
  width?: number;
  height?: number;
  color?: string;
  blurHash?: string;
  urls: { thumb: string; small: string; regular: string };
  user: { name: string; link: string };
  onChooseImgUrl?: string;
};

export interface LearnItemProgress {
  due: ISODate;
  stage: Stage;
  interval: number;
  easiness: number;
  timesCorrect: number;
  timesWrong: number;
  updated: ISODate;
}
export type StatisticsItemProgress = Omit<LearnItemProgress, 'updated'> & {
  timesTotal: number;
};

export type LearnItem = {
  id: string;
  created: ISODate;
  updated: ISODate;
  prompt: string;
  promptAddition?: string;
  solution: string;
  flagged?: boolean;
  image?: UnsplashImage | null;
  // frontend
  isNew?: boolean;
  doubletOf?: number;
  index?: number;
};
export type LearnItemWithProgress = LearnItem & { progress: LearnItemProgress };
export type LearnItemEditFields = Pick<
  LearnItem,
  'prompt' | 'promptAddition' | 'solution' | 'flagged' | 'image'
>;

export const includeListKeys = ['items', 'flaggedItems', 'lastLearnt', 'progress'] as const;
export type IncludeListKeys = (typeof includeListKeys)[number];
export type IncludeListOptions = Partial<Record<IncludeListKeys | 'NONE', boolean>>;
export type MappedList<Options extends IncludeListOptions> = {
  id: string;
  name: string;
  slug: string;
  created: ISODate;
  updated: ISODate;
  learnCount?: number;
  repeat?: boolean;
  itemsCount: number;
  progress: Options['progress'] extends true ? ReturnType<typeof getProgressSummary> : undefined;
  items: Options['items'] extends true ? ReturnType<typeof mapItem>[] : undefined;
  flaggedItems: Options['flaggedItems'] extends true ? ReturnType<typeof mapItem>[] : undefined;
  lastLearnt: Options['lastLearnt'] extends true ? Date : undefined;
};

export type BareList<T extends IncludeListKeys> = MappedList<Record<T, true>>;
export type List<T extends IncludeListKeys | 'NONE' = 'NONE'> = MappedList<Record<T, true>>;
