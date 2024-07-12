'use client';

import { classNames } from '@/helpers/class-names';
import { getColor, getLegend } from '@/helpers/progress-mappers';
import { ListProgressSummary } from '@/types/types';
import { FC, useState } from 'react';

type ProgressBarProps = {
  stages: ListProgressSummary;
  showCountPerStage?: boolean;
  showCountOnClick?: boolean;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  stages,
  showCountPerStage,
  showCountOnClick,
}) => {
  const [showCount, setShowCount] = useState(false);

  const Element = showCountOnClick ? 'button' : 'div';

  return (
    <Element
      onClick={showCountOnClick ? () => setShowCount((s) => !s) : undefined}
      className={classNames('w-full h-10 flex text-xs', showCountOnClick && 'focus-primary')}
    >
      {Object.entries(stages).map(([stage, count]) => (
        <div
          key={stage}
          className={classNames(
            'h-10 px-2 flex items-center justify-center pointer-events-none',
            getColor(stage),
          )}
          style={{ flexGrow: count }}
        >
          <span className="inline-block min-w-[40px] text-center">
            {showCount || showCountPerStage ? count : getLegend(stage)}
          </span>
        </div>
      ))}
    </Element>
  );
};
