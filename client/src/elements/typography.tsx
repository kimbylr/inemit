import styled from 'styled-components';

export const Paragraph = styled.p`
  line-height: 1.5;
  font-size: ${({ theme: { font } }) => font.sizes.sm};
  color: ${({ theme: { colors } }) => colors.grey[10]};
  font-weight: ${({ theme: { font } }) => font.weights.light};

  & strong {
    font-weight: ${({ theme: { font } }) => font.weights.bold};
    color: ${({ theme: { colors } }) => colors.grey[25]};
  }
`;

export const Heading = styled.h2`
  color: ${({ theme: { colors } }) => colors.primary[150]};
  font-size: ${({ theme: { font } }) => font.sizes.xl};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  overflow-wrap: break-word;
`;

export const SubHeadingUncolored = styled.h3`
  font-size: ${({ theme: { font } }) => font.sizes.md};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  margin: 1.5rem 0 1rem;
  overflow-wrap: break-word;
`;

export const SubHeading = styled(SubHeadingUncolored)`
  color: ${({ theme: { colors } }) => colors.primary[150]};
`;

export const SubSubHeading = styled(SubHeading).attrs({ as: 'h4' })`
  font-size: ${({ theme: { font } }) => font.sizes.sm};
`;
