import React, { FC } from 'react';
import styled from 'styled-components';
import { Icon } from './icon';

interface Props {
  checked: boolean;
  onCheck(): void;
  small?: boolean;
}
export const Checkbox: FC<Props> = ({ children, checked, onCheck, small }) => (
  <Label small={small}>
    <InvisibleActualCheckbox
      type="checkbox"
      checked={checked}
      onChange={() => onCheck()}
    />
    <CheckboxContainer small={small}>
      <CheckboxDiv checked={checked} small={small} />
      {checked && (
        <CheckboxHook small={small}>
          <Icon type="done" />
        </CheckboxHook>
      )}
    </CheckboxContainer>
    <Text>{children}</Text>
  </Label>
);

const Label = styled.label<{ small?: boolean }>`
  cursor: pointer;
  font-size: ${({ small, theme: { font } }) => (small ? font.sizes.xxs : font.sizes.xs)};
  display: flex;
  align-items: ${({ small }) => (small ? 'flex-end' : 'flex-start')};

  color: ${({ theme: { colors } }) => colors.grey[85]};
  :focus-within {
    color: ${({ theme: { colors } }) => colors.grey[50]};
  }
`;

const InvisibleActualCheckbox = styled.input`
  clip: rect(0, 0, 0, 0);
  position: absolute;
  height: 0;
  width: 0;
`;

const CheckboxContainer = styled.div<{ small?: boolean }>`
  width: ${({ small }) => (small ? '1.25rem' : '1.75rem')};
  padding-top: 1px;
  flex-shrink: 0;
  position: relative;
`;

const CheckboxDiv = styled.div<{ checked: boolean; small?: boolean }>`
  height: ${({ small }) => (small ? '1rem' : '1.25rem')};
  width: ${({ small }) => (small ? '1rem' : '1.25rem')};
  box-sizing: border-box;
  border: 2px solid
    ${({ theme: { colors }, checked }) =>
      checked ? colors.primary[100] : 'currentColor'};
  border-radius: 2px;
  background: ${({ checked, theme: { colors } }) =>
    checked ? colors.primary[100] : 'white'};
`;

const CheckboxHook = styled.div<{ small?: boolean }>`
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  height: ${({ small }) => (small ? '0.75rem' : '1rem')};
  width: ${({ small }) => (small ? '0.75rem' : '1rem')};
  pointer-events: none;
  color: white;
`;

const Text = styled.span`
  color: ${({ theme: { colors } }) => colors.grey[10]};
`;
