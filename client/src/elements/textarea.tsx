import styled from 'styled-components';

export const Textarea = styled.textarea`
  color: ${({ theme: { colors } }) => colors.grey[10]};
  font-size: ${({ theme: { font } }) => font.sizes.sm};
  border: 2px solid ${({ theme: { colors } }) => colors.grey[85]};
  outline: none;
  padding: 0.375rem;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;

  :focus {
    border-color: ${({ theme: { colors } }) => colors.grey[50]};
  }

  :disabled {
    background-color: ${({ theme: { colors } }) => colors.grey[98]};
    color: ${({ theme: { colors } }) => colors.grey[85]};
  }

  ::placeholder {
    color: ${({ theme: { colors } }) => colors.grey[85]};
  }
`;
