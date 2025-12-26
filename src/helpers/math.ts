export const percent = (total: number, part: number) => `${((part / total) * 100).toFixed(0)} %`;

export const sum = (acc: number, cur: number): number => acc + cur;
