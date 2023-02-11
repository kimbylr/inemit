import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export const Container = styled.main`
  padding: 1.5rem 1rem 1rem;
  position: relative;
`;

const Shadow = styled.div`
  width: 100%;
  height: 20px;
  overflow: hidden;
  position: absolute;
  ::before {
    content: '';
    pointer-events: none;
    position: absolute;
    left: -20px;
    top: 0;
    right: -20px;
    bottom: -20px;
    box-shadow: inset 0 0px 10px rgba(0, 0, 0, 1);
  }
`;

// separate Shadow element because "overflow: hidden" prevents sticky elements inside children
export const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Shadow />
    <Container>{children}</Container>
  </>
);
