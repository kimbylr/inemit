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

export const StickyParagraph = styled(Paragraph)`
  position: sticky;
  top: 0;
  padding: 10px 0;
  background: ${({ theme: { colors } }) => colors.grey[98]};
`;

// ====

export const Heading = styled.h2`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: ${({ theme: { font } }) => font.sizes.xl};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
`;

export const SubHeadingUncolored = styled.h3`
  font-size: ${({ theme: { font } }) => font.sizes.md};
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  margin: 1.5rem 0 1rem;
`;

export const SubHeading = styled(SubHeadingUncolored)`
  color: ${({ theme: { colors } }) => colors.primary[100]};
`;
