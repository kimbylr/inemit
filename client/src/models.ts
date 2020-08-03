export enum LoadingStates {
  initial = 'initial',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error',
}

// see https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean
export type ExcludesNull = <T>(x: T | null) => x is T;

export type ISODate = string; // e.g. "2020-02-22T17:34:46.822Z"

export interface ProgressSummaryStages {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
}
export interface ProgressSummary {
  stages: ProgressSummaryStages;
  dueToday: number;
  dueTomorrow: number;
}

export interface ListSummary {
  id: string;
  name: string;
  slug: string;
  created: ISODate;
  updated: ISODate;
  itemsCount: number;
}

export interface ListWithProgress extends ListSummary {
  progress: ProgressSummary;
}

export interface BaseLearnItem {
  prompt: string;
  solution: string;
  flagged?: boolean;
}
export interface LearnItemForEditing extends BaseLearnItem {
  id: string;
  isNew?: boolean;
  doubletOf?: number;
}
export interface LearnItemForLearning extends BaseLearnItem {
  id: string;
  created: ISODate;
  updated: ISODate;
}
export interface LearnItem extends BaseLearnItem {
  id: string;
  created: ISODate;
  updated: ISODate;
  progress: Progress;
}
export interface LearnItemWithDoublet extends LearnItem {
  doubletOf?: number;
}

export interface Progress {
  id: string;
  lastLearnt?: ISODate;
  due: ISODate;
  stage: number;
  interval: number;
  easiness: number;
  timesCorrect: number;
  timesWrong: number;
  updated: ISODate;
}
