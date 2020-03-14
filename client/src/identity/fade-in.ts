import { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const FadeInWithDelay = css`
  opacity: 0;
  animation: ${fadeIn} 1s ease-in 0.5s;
  animation-fill-mode: forwards;
`;

export const FadeIn = css`
  opacity: 0;
  animation: ${fadeIn} 0.2s;
  animation-fill-mode: forwards;
`;
