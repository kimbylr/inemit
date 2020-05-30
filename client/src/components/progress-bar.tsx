import React, { FC } from 'react';
import styled from 'styled-components';
import { getColor, getLegend } from '../helpers/progress-mappers';
import { ProgressSummaryStages } from '../models';

interface ProgressBarProps {
  stages: ProgressSummaryStages;
}

export const ProgressBar: FC<ProgressBarProps> = ({ stages }) => (
  <Bar>
    {Object.entries(stages).map(([stage, count]) => (
      <BarPart stage={stage} count={count} key={stage}>
        {getLegend(stage)}
      </BarPart>
    ))}
  </Bar>
);

const Bar = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;

const BarPart = styled.div<{ stage: string; count: number }>`
  height: 100%;
  padding: 4px 8px;
  flex-grow: ${({ count }) => count};
  background: ${({ stage, theme: { colors } }) => getColor(colors, stage)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
