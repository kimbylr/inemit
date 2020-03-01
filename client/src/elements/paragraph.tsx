import styled from 'styled-components';

export const Paragraph = styled.p`
  line-height: 1.5;
  color: ${({ theme: { colors } }) => colors.grey[10]};
`;
