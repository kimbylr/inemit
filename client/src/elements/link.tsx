import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const Link = styled(RouterLink)`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  text-decoration: underline;

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[150]};
  }
`;

export const ExtLink = styled.a`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  text-decoration: underline;

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[150]};
  }
`;
