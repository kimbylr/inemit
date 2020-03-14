import styled from 'styled-components';

export const Button = styled.button<{ primary?: boolean }>`
  background: ${({ primary, theme: { colors } }) =>
    primary ? colors.primary[100] : colors.grey[75]};
  color: ${({ theme: { colors } }) => colors.grey[25]};

  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
  font-weight: 600;

  cursor: pointer;
  user-select: none;
  outline: none; /** TODO: make accessible */
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px
    ${({ primary, theme: { colors } }) =>
      primary ? colors.primary[150] : colors.grey[60]};
  padding: 0.5rem 1rem;
  margin: 4px 0;

  :hover:not(:disabled),
  :active:not(:disabled) {
    color: ${({ theme: { colors } }) => colors.grey[98]};
  }

  :active {
    background: ${({ primary, theme: { colors } }) =>
      primary ? colors.primary[150] : colors.grey[60]};
    box-shadow: none;
    position: relative;
    top: 4px;
  }

  :disabled {
    opacity: 0.5;
  }
`;

/*
button .icon {
  margin-right: 10px;
}

button.small {
  padding: 6px 12px;
}

button.small .icon {
  margin-right: 6px;
}
*/
