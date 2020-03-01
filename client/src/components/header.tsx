import React from 'react';
import styled from 'styled-components';

export const Header = () => <Container>inemit!</Container>;

const Container = styled.div`
  width: 100%;
  font-size: ${({ theme: { font } }) => font.sizes.xxl};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  padding: 0.5rem 0;
  box-shadow: 0px 4px 20px -4px #000000;
  background: linear-gradient(
    to bottom,
    ${({ theme: { colors } }) => colors.primary[100]},
    ${({ theme: { colors } }) => colors.primary[150]}
  );
  color: ${({ theme: { colors } }) => colors.grey[98]};
  text-align: center;
`;
