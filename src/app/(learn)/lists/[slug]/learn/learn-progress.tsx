import { merge } from '@/helpers/merge';
import { FC } from 'react';

const MAX_DOTS = 16;

type LearnProgressProps = {
  correct: number;
  incorrect: number;
  total: number;
};

export const LearnProgress: FC<LearnProgressProps> = ({ correct, incorrect, total }) => {
  const factor = Math.min(MAX_DOTS / total, 1);
  const correctDots = Math.ceil(correct * factor);
  const incorrectDots = Math.ceil(incorrect * factor);
  const totalDots = Math.min(total, MAX_DOTS);

  return (
    <div className="flex gap-1.5 md:gap-2.5 mt-1">
      {Array.from({ length: totalDots }, (_, i) => (
        <span
          key={i}
          className={merge(
            'size-1.5 rounded-full transition-colors duration-500',
            getDotColor(i < correctDots, i >= totalDots - incorrectDots),
          )}
        />
      ))}
    </div>
  );
};

const getDotColor = (correct: boolean, incorrect: boolean) => {
  if (correct) return 'bg-primary-100';
  if (incorrect) return 'bg-negative-100';
  return 'bg-gray-90';
};
