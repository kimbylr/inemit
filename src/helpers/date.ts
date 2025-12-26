import { Dayjs } from 'dayjs';

export const isWeekend = (date: Dayjs) => [0, 6].includes(date.day());
