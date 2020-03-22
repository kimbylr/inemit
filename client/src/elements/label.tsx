import styled from 'styled-components';

export const Label = styled.label`
  display: block;
  font-weight: ${({ theme: { font } }) => font.weights.bold};
  font-size: ${({ theme: { font } }) => font.sizes.xxs};
  color: ${({ theme: { colors } }) => colors.grey[60]};
  text-transform: uppercase;

  input {
    margin-bottom: 4px;
  }
`;
