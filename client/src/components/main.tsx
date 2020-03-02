import styled from 'styled-components';

export const Main = styled.main`
  padding: 1.5rem 1rem 1rem;

  position: relative;
  overflow: hidden;
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
