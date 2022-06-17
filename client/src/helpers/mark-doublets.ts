import { LearnItem } from '../models';

const normalise = (solution: string): string =>
  solution
    .trim()
    .toLowerCase()
    .replace(/[.…?!]/g, '');

export const markDoublets = (items: LearnItem[]): LearnItem[] => {
  const arr = items.map(({ solution }, index) => ({
    solution: normalise(solution),
    index,
  }));

  return items.map((item, i) => ({
    ...item,
    doubletOf: arr.filter(
      ({ solution }, j) => solution === arr[i].solution && j !== arr[i].index,
    )[0]?.index,
  }));
};
