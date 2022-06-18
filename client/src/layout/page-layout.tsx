import React, { FC } from 'react';
import styled from 'styled-components';

export const PageLayout: FC<{ width?: 'wide' | 'tight' }> = ({
  children,
  width = 'tight',
}) => <Container width={width}>{children}</Container>;

export const Container = styled.div<{ width: 'tight' | 'wide' }>`
  max-width: ${({ width }) => (width === 'wide' ? '1140px' : '760px')};
  margin: 0 auto;

  @media (min-width: 720px) {
    margin-top: 1rem;
  }
`;
