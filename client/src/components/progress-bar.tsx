import { FC, useState } from 'react';
import { getColor, getLegend } from '../helpers/progress-mappers';
import { ProgressSummaryStages } from '../models';

type ProgressBarProps = {
  stages: ProgressSummaryStages;
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
      className={`w-full h-10 flex text-xs ${
        showCountOnClick ? 'dotted-focus dotted-focus-dark' : ''
      }`}
    >
      {Object.entries(stages).map(([stage, count]) => (
        <div
          key={stage}
          className={`h-10 px-2 ${getColor(
            stage,
          )} flex items-center justify-center pointer-events-none`}
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
