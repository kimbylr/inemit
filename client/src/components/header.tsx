import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '../elements/icon';

export const Header: FC = () => (
  <Container>
    <StyledLink to="/">
      <Icon type="logo" width="30px" />
      inemit!
    </StyledLink>
  </Container>
);

const Container = styled.div`
  width: 100%;
  padding: max(env(safe-area-inset-top), 0.5rem) 0 0.5rem;
  background: linear-gradient(
    to bottom,
    ${({ theme: { colors } }) => colors.primary[100]},
    ${({ theme: { colors } }) => colors.primary[150]}
  );
  text-align: center;
  user-select: none;
`;

const StyledLink = styled(Link)`
  font-size: ${({ theme: { font } }) => font.sizes.xxl};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  color: ${({ theme: { colors } }) => colors.grey[98]};
  text-decoration: none;

  svg {
    margin-right: 24px;
  }
`;
