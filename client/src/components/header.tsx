import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Header = () => (
  <Container>
    <StyledLink to="/">inemit!</StyledLink>
  </Container>
);

const Container = styled.div`
  width: 100%;
  padding: 0.5rem 0;
  box-shadow: 0px 4px 20px -4px #000000;
  background: linear-gradient(
    to bottom,
    ${({ theme: { colors } }) => colors.primary[100]},
    ${({ theme: { colors } }) => colors.primary[150]}
  );
  text-align: center;
`;

const StyledLink = styled(Link)`
  font-size: ${({ theme: { font } }) => font.sizes.xxl};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  color: ${({ theme: { colors } }) => colors.grey[98]};
  text-decoration: none;
`;
