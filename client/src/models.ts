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
export interface ProgressSummaryDue {
  '0': number;
  '2': number;
  '7': number;
  '14': number;
  '30': number;
  more: number;
}
export interface ProgressSummary {
  stages: ProgressSummaryStages;
  dueBeforeDays: ProgressSummaryDue;
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
}
export interface LearnItem extends BaseLearnItem {
  _id?: string; // TODO
  id: string;
  created: ISODate;
  updated: ISODate;
  progress: Progress;
}

export interface Progress {
  _id?: string; // TODO
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
