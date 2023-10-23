'use client';

import React, { FC } from 'react';
import { getColor, getLegend } from '../helpers/progress-mappers';
import { ListProgressSummary } from '@/types/types';

// inspired by https://www.smashingmagazine.com/2015/07/designing-simple-pie-charts-with-css/

const CIRCLE_COORDINATES = {
  centreX: 35.75,
  centreY: 41.5,
  radius: 100 / Math.PI, // i.e. 1/2 circumfence == 100%
};

const MIN_PERCENTAGE = 2;

const getTotal = (numbers: number[]): number => numbers.reduce((acc, cur) => acc + cur, 0);

export const ProgressPie: FC<{ stages: ListProgressSummary }> = ({ stages }) => {
  const counts = Object.values(stages);
  const factor = (100 - counts.length * MIN_PERCENTAGE) / getTotal(counts);
  const percentages = counts.map((count) => count * factor + MIN_PERCENTAGE);

  return (
    <svg className="w-full h-auto" viewBox="0 0 80 40">
      {percentages.map((percentage, i) => {
        const offset = getTotal(percentages.slice(0, i));
        const displayInlineLegend = percentage >= 10;

        return (
          <React.Fragment key={i + 1}>
            <circle
              r={CIRCLE_COORDINATES.radius}
              cx="40"
              cy="40"
              className={`fill-none stroke-[16] ${getColor(`${i + 1}`, 'stroke')}`}
              style={{
                strokeDasharray: `${percentage} 200`,
                transform: `rotate(${180 + offset * 1.8}deg)`,
                transformOrigin: '50% 100%',
              }}
            />
            {displayInlineLegend && (
              <Legend percentage={percentage} offset={offset} stage={i + 1} />
            )}
          </React.Fragment>
        );
      })}
    </svg>
  );
};

interface LegendProps {
  percentage: number;
  offset: number;
  stage: number;
}
const Legend = ({ percentage, offset, stage }: LegendProps) => {
  const { centreX, centreY, radius } = CIRCLE_COORDINATES;
  const angle = Math.PI * (1 - (offset + percentage / 2) / 100);
  const legendX = centreX + radius * Math.cos(angle);
  const legendY = centreY - radius * Math.sin(angle);

  return (
    <text className="text-[30%]" x={legendX} y={legendY}>
      {getLegend(stage)}
    </text>
  );
};
