import React, { FC } from 'react';
import styled from 'styled-components';
import { getColor, getLegend } from '../helpers/progress-mappers';
import { ProgressSummaryStages } from '../models';

// inspired by https://www.smashingmagazine.com/2015/07/designing-simple-pie-charts-with-css/

const CIRCLE_COORDINATES = {
  centreX: 35.75,
  centreY: 41.5,
  radius: 100 / Math.PI, // i.e. 1/2 circumfence == 100%
};

const MIN_PERCENTAGE = 2;

const getTotal = (numbers: number[]): number =>
  numbers.reduce((acc, cur) => acc + cur, 0);

interface ProgressBarProps {
  stages: ProgressSummaryStages;
}

export const ProgressPie: FC<ProgressBarProps> = ({ stages }) => {
  const counts = Object.values(stages);
  const factor = (100 - counts.length * MIN_PERCENTAGE) / getTotal(counts);
  const percentages = counts.map(count => count * factor + MIN_PERCENTAGE);

  return (
    <Svg viewBox="0 0 80 40">
      {percentages.map((percentage, i) => {
        const offset = getTotal(percentages.slice(0, i));
        const displayInlineLegend = percentage >= 10;

        return (
          <React.Fragment key={i + 1}>
            <SvgCircle
              r={CIRCLE_COORDINATES.radius}
              cx="40"
              cy="40"
              stage={`${i + 1}`}
              offset={offset}
              percentage={percentage}
            />
            {displayInlineLegend && (
              <Legend percentage={percentage} offset={offset} stage={i + 1} />
            )}
          </React.Fragment>
        );
      })}
    </Svg>
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
    <SvgText x={legendX} y={legendY}>
      {getLegend(`${stage}`)}
    </SvgText>
  );
};

const Svg = styled.svg`
  width: 100%;
  height: auto;
`;

interface SvgCircleProps {
  stage: string;
  offset: number;
  percentage: number;
}
const SvgCircle = styled.circle<SvgCircleProps>`
  fill: none;
  stroke: ${({ theme: { colors }, stage }) => getColor(colors, stage)};
  stroke-width: 16;
  stroke-dasharray: ${({ percentage }) => percentage} 200;
  transform: rotate(${({ offset }) => 180 + offset * 1.8}deg);
  transform-origin: 50% 100%;
`;

const SvgText = styled.text`
  font-size: 30%;
`;
