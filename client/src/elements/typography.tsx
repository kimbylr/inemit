import styled from 'styled-components';

export const Paragraph = styled.p`
  line-height: 1.5;
  font-size: ${({ theme: { font } }) => font.sizes.sm};
  color: ${({ theme: { colors } }) => colors.grey[10]};

  & strong {
    font-weight: ${({ theme: { font } }) => font.weights.bold};
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }
`;

export const Heading = styled.h2`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: ${({ theme: { font } }) => font.sizes.xl};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
`;

export const SubHeading = styled.h3`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: ${({ theme: { font } }) => font.sizes.lg};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  margin-top: 2rem;
`;
