import styled from 'styled-components';

export const Button = styled.button<{ primary?: boolean; small?: boolean }>`
  background: ${({ primary, theme: { colors } }) =>
    primary ? colors.primary[100] : colors.grey[75]};
  color: ${({ primary, theme: { colors } }) =>
    primary ? colors.grey[98] : colors.grey[25]};

  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  font-size: ${({ small, theme: { font } }) => (small ? font.sizes.xxs : font.sizes.xs)};
  font-weight: 600;
  position: relative;

  cursor: pointer;
  user-select: none;
  outline: none;
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px
    ${({ primary, theme: { colors } }) =>
      primary ? colors.primary[150] : colors.grey[60]};
  padding: ${({ small }) => (small ? '5px 12px' : '8px 16px')};
  margin: 0 0 4px;

  :hover:not(:disabled),
  :active {
    color: ${({ primary, theme: { colors } }) =>
      primary ? colors.grey[25] : colors.grey[98]};
  }

  :active {
    background: ${({ primary, theme: { colors } }) =>
      primary ? colors.primary[150] : colors.grey[60]};
    box-shadow: none;
    top: 4px;
  }

  :focus-visible:not(:active)::after {
    content: '';
    position: absolute;
    inset: -6px -6px -10px;
    border-radius: 8px;
    border: 3px dotted
      ${({ primary, theme: { colors } }) =>
        primary ? colors.primary[50] : colors.grey[75]};
  }

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    position: relative;
    top: 1px;
    margin-right: 4px;
  }
`;

export const CautionButton = styled(Button)`
  background: ${({ theme: { colors } }) => colors.negative[75]};
  box-shadow: 0 4px ${({ theme: { colors } }) => colors.negative[150]};

  :active {
    background: ${({ theme: { colors } }) => colors.negative[150]};
  }
`;
