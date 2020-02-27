import styled from 'styled-components';

export const Button = styled.button<{ primary?: boolean }>`
  background: ${({ primary, theme: { colors } }) =>
    primary ? colors.primary[100] : colors.grey[75]};
  color: ${({ theme: { colors } }) => colors.grey[25]};

  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
  outline: none; /** TODO: make accessible */
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px
    ${({ primary, theme: { colors } }) =>
      primary ? colors.primary[150] : colors.grey[50]};
  padding: 0.625rem 1rem;
  margin: 4px 0;

  :hover,
  :active {
    color: ${({ theme: { colors } }) => colors.grey[95]};
  }

  :active {
    background: ${({ primary, theme: { colors } }) =>
      primary ? colors.primary[150] : colors.grey[50]};
    box-shadow: none;
    position: relative;
    top: 4px;
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

button:disabled,
button:disabled:hover,
button:disabled:active {
  color: #bbb;
  background-color: #e6e6e6;
  box-shadow: 0 3px #ccc;
  cursor: default;
  transition-duration: 0.2s;
  top: 0; /* patch for weird behaviour when :active
}
*/
