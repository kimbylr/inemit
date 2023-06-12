import React, { FC, useState } from 'react';
import styled from 'styled-components';
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

  return (
    <Bar
      onClick={showCountOnClick ? () => setShowCount((s) => !s) : undefined}
      as={showCountOnClick ? 'button' : undefined}
      isButton={showCountOnClick}
      className="dotted-focus dotted-focus-dark"
    >
      {Object.entries(stages).map(([stage, count]) => (
        <BarPart key={stage} stage={stage} count={count}>
          <Content>{showCount || showCountPerStage ? count : getLegend(stage)}</Content>
        </BarPart>
      ))}
    </Bar>
  );
};

const Bar = styled.div<{ isButton?: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
  padding: 0;
  margin: 0;
  border: none;
  ${({ isButton }) => (isButton ? 'cursor: pointer;' : undefined)}
`;

const BarPart = styled.div<{ stage: string; count: number }>`
  height: 40px;
  padding: 0 8px;
  flex-grow: ${({ count }) => count};
  background: ${({ stage, theme: { colors } }) => getColor(colors, stage)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  pointer-events: none;
`;

const Content = styled.span`
  display: inline-block;
  min-width: 40px;
  text-align: center;
`;
