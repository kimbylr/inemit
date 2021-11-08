import React, { FC } from 'react';
import styled from 'styled-components';
import { getColor, getLegend } from '../helpers/progress-mappers';
import { ProgressSummaryStages } from '../models';

type ProgressBarProps = {
  stages: ProgressSummaryStages;
  showCountPerStage?: boolean;
};
export const ProgressBar: FC<ProgressBarProps> = ({ stages, showCountPerStage }) => {
  const totalCount: number = Object.values(stages).reduce((acc, cur) => acc + cur, 0);
  const encore = totalCount / 12.5; // add 8% to each stage for countPerStage => more levelled bars

  return (
    <Bar>
      {Object.entries(stages).map(([stage, count]) => (
        <BarPart
          title={`${stage}. Fach: ${count} ${count === 1 ? 'Vokabel' : 'Vokabeln'}`}
          stage={stage}
          count={showCountPerStage ? count + encore : count}
          key={stage}
          showBorders={showCountPerStage}
        >
          {showCountPerStage ? count : getLegend(stage)}
        </BarPart>
      ))}
    </Bar>
  );
};

const Bar = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
  pointer-events: none;
`;

const BarPart = styled.div<{ stage: string; count: number; showBorders?: boolean }>`
  height: 32px;
  padding: 4px 8px;
  flex-grow: ${({ count }) => count};
  background: ${({ stage, theme: { colors } }) => getColor(colors, stage)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
`;
