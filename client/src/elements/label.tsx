import styled from 'styled-components';

export const Label = styled.label`
  display: block;
  font-weight: ${({ theme: { font } }) => font.weights.bold};
  font-size: ${({ theme: { font } }) => font.sizes.xs};
  color: ${({ theme: { colors } }) => colors.grey[25]};
  text-transform: uppercase;
  margin-bottom: 2px;
`;
