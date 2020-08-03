import React, { FC } from 'react';
import styled from 'styled-components';
import { Icon } from './icon';

interface Props {
  checked: boolean;
  onCheck(): void;
}
export const Checkbox: FC<Props> = ({ children, checked, onCheck }) => (
  <Label>
    <InvisibleActualCheckbox
      type="checkbox"
      checked={checked}
      onClick={() => onCheck()}
    />
    <CheckboxContainer>
      <CheckboxDiv checked={checked} />
      {checked && (
        <CheckboxHook>
          <Icon type="done" />
        </CheckboxHook>
      )}
    </CheckboxContainer>
    {children}
  </Label>
);

const Label = styled.label`
  display: flex;
  cursor: pointer;
`;

const InvisibleActualCheckbox = styled.input`
  position: absolute;
  height: 0;
  width: 0;
`;

const CheckboxContainer = styled.div`
  width: 1.75rem;
  padding-top: 1px;
  flex-shrink: 0;
  position: relative;
`;

const CheckboxDiv = styled.div<{ checked: boolean }>`
  height: 1.25rem;
  width: 1.25rem;
  color: ${({ theme: { colors } }) => colors.primary[100]};
  box-sizing: border-box;
  border: 2px solid ${({ theme: { colors } }) => colors.primary[100]};
  border-radius: 2px;
  background: ${({ checked, theme: { colors } }) =>
    checked ? colors.primary[100] : 'white'};
`;

const CheckboxHook = styled.div`
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  height: 1rem;
  width: 1rem;
  pointer-events: none;
  color: white;
`;
