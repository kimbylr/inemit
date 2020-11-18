import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { FadeInWithDelay } from '../identity/fade-in';

export const Spinner: FC<{ white?: boolean; small?: boolean }> = ({
  white,
  small,
}) => (
  <Container white={white} small={small}>
    <Bounce1 />
    <Bounce2 />
  </Container>
);

const Container = styled.div<{ white?: boolean; small?: boolean }>`
  width: ${({ small }) => (small ? '30px' : '50px')};
  min-width: ${({ small }) => (small ? '30px' : '50px')};
  height: ${({ small }) => (small ? '30px' : '50px')};
  position: relative;
  margin: 15px auto;
  color: ${({ white, theme: { colors, grey } }) =>
    white ? colors.grey[98] : colors.primary[100]};
  ${FadeInWithDelay}
`;

const bounce = keyframes`
0%, 100% {
  transform: scale(0.0);
} 50% {
  transform: scale(1.0);
}
`;

const Bounce1 = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bounce} 2s infinite ease-in-out;
`;

const Bounce2 = styled(Bounce1)`
  animation-delay: -1s;
`;
