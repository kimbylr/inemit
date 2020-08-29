import React, { FC } from 'react';
import styled from 'styled-components';

export const PageLayout: FC = ({ children }) => (
  <Container>{children}</Container>
);

export const Container = styled.div`
  max-width: 660px;
  margin: 0 auto;

  @media (min-width: 720px) {
    margin-top: 1rem;
  }
`;
