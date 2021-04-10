import React, { FC } from 'react';
import styled from 'styled-components';

interface LearnProgressProps {
  count: {
    correct: number;
    incorrect: number;
  };
  total: number;
}
export const LearnProgress: FC<LearnProgressProps> = ({ count, total }) => (
  <Container>
    <Bar type="correct" count={count.correct} />
    <Bar type="pending" count={total - count.correct - count.incorrect} />
    <Bar type="incorrect" count={count.incorrect} />
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: calc(env(safe-area-inset-top) + 0.25rem);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;

  ::before {
    position: absolute;
    content: '';
    height: env(safe-area-inset-top);
    width: 100%;
    background: ${({ theme: { colors } }) => colors.grey[10]};
  }
`;

interface BarProps {
  count: number;
  type: 'correct' | 'pending' | 'incorrect';
}
const Bar = styled.div<BarProps>`
  background: ${({ type, theme: { colors } }) =>
    type === 'correct'
      ? colors.primary[100]
      : type === 'incorrect'
      ? colors.negative[100]
      : 'rgba(0,0,0,0)'};
  flex: ${({ count }) => count};
  height: 100%;
  transition: 0.4s;
`;
