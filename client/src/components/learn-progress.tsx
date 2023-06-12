import React, { FC } from 'react';

interface LearnProgressProps {
  count: {
    correct: number;
    incorrect: number;
  };
  total: number;
}
export const LearnProgress: FC<LearnProgressProps> = ({ count, total }) => (
  <div
    className="w-full flex fixed top-0 left-0"
    style={{ height: 'calc(env(safe-area-inset-top) + 0.25rem)' }}
  >
    <div
      className="absolute z-10 w-full bg-grey-10"
      style={{ height: 'env(safe-area-inset-top)' }}
    />
    <div className="h-full duration-[0.4s] bg-primary-100" style={{ flex: `${count.correct}` }} />
    <div
      className="h-full duration-[0.4s]"
      style={{ flex: `${total - count.correct - count.incorrect}` }}
    />
    <div
      className="h-full duration-[0.4s] bg-negative-100"
      style={{ flex: `${count.incorrect}` }}
    />
  </div>
);
