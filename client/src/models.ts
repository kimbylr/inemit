export interface Progress {
  _id?: string; // TODO
  id: string;
  lastLearnt?: string; // Date
  due: string; // Date
  stage: number;
  interval: number;
  easiness: number;
  timesCorrect: number;
  timesWrong: number;
  updated: string; // Date
}

export interface LearnItem {
  _id?: string; // TODO
  id: string;
  created: string; // Date
  updated: string; // Date
  prompt: string;
  solution: string;
  progress: Progress;
}

export interface ListWithItems {
  _id?: string; // TODO
  id: string;
  name: string;
  slug: string;
  created: string; // Date
  updated: string; // Date
  items: LearnItem[];
}

export interface ProgressSummary {
  stages: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
  };
  dueBeforeDays: {
    '0': number;
    '2': number;
    '7': number;
    '14': number;
    '30': number;
    more: number;
  };
}

export interface ListSummary {
  id: string;
  name: string;
  slug: string;
  itemsCount: number;
  progress?: ProgressSummary;
}

export enum LoadingStates {
  initial = 'initial',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error',
}
