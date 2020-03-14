import styled from 'styled-components';
import React, { FC } from 'react';
import { ProgressSummaryStages } from '../models';

interface ProgressBarProps {
  stages: ProgressSummaryStages;
}

export const ProgressBar: FC<ProgressBarProps> = ({ stages }) => (
  <Bar>
    {Object.entries(stages).map(([stage, count]) => (
      <BarPart stage={stage} count={count} key={stage}>
        {mapLegendToStage[stage]}
      </BarPart>
    ))}
  </Bar>
);

const mapLegendToStage: { [key: string]: string } = {
  1: '◔_◔',
  2: '•_•',
  3: '◡‿◡',
  4: '◠‿◠',
};

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

const getColor = (colors: { [key: string]: string }, stage: string) => {
  switch (stage) {
    case '1':
      return colors.yellow[50];
    case '2':
      return colors.secondary[50];
    case '3':
      return colors.primary[100];
    case '4':
      return colors.primary[150];
    default:
      return null;
  }
};
