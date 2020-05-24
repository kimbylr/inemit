import styled from 'styled-components';

export const Input = styled.input`
  color: ${({ theme: { colors } }) => colors.grey[10]};
  font-size: ${({ theme: { font } }) => font.sizes.sm};
  border: 2px solid ${({ theme: { colors } }) => colors.grey[85]};
  outline: none;
  padding: 0.375rem;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  -webkit-appearance: none;

  :focus {
    border-color: ${({ theme: { colors } }) => colors.grey[50]};
  }

  transition-property: opacity;
  transition-duration: 0.2s;

  :disabled {
    opacity: 0.5;
    transition-delay: 0.2s;
    cursor: not-allowed;
  }

  ::placeholder {
    color: ${({ theme: { colors } }) => colors.grey[85]};
  }
`;
