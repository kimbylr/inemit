'use client';

import { getPercentages } from '@/helpers/calculate-percentage';
import { classNames } from '@/helpers/class-names';
import { getColor, getLegend } from '@/helpers/progress-mappers';
import { ListProgressSummary } from '@/types/types';
import { FC, useState } from 'react';

type Modes = 'legend' | 'count' | 'percentage';

type Props = {
  stages: ListProgressSummary;
  modes: Modes[];
};

export const ListProgress: FC<Props> = ({ stages, modes }) => {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const activeMode = modes[activeModeIndex];
  const percentages = getPercentages(stages);

  return (
    <button
      onClick={() => setActiveModeIndex((i) => (i + 1) % modes.length)}
      className="w-full h-10 flex text-xs focus-primary"
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
            {activeMode === 'legend' && getLegend(stage)}
            {activeMode === 'count' && count}
            {activeMode === 'percentage' && percentages[stage as unknown as 1 | 2 | 3 | 4]}{' '}
          </span>
        </div>
      ))}
    </button>
  );
};
