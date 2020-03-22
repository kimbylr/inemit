import React, { FC, useState, ReactNode } from 'react';
import { Icon } from '../elements/icon';
import styled, { keyframes, css } from 'styled-components';

interface Props {
  error: boolean;
  saved: boolean;
  saving: boolean;
  submit: (event: React.MouseEvent<Element, MouseEvent>) => Promise<void>;
}

export const EditStatus: FC<Props> = ({ saving, saved, error, submit }) => {
  if (saving) {
    return (
      <Saving>
        <Icon type="sync" />
      </Saving>
    );
  }

  if (error) {
    return (
      <SaveButton type="submit" error={error} onClick={submit} tabIndex={-1}>
        <Icon type="attention" />
      </SaveButton>
    );
  }

  if (saved) {
    return (
      <Saved>
        <Icon type="ok" />
      </Saved>
    );
  }

  return (
    <SaveButton type="submit" onClick={submit} tabIndex={-1}>
      <Icon type="ok" />
    </SaveButton>
  );
};

const BaseStyles = css`
  height: 24px;
  width: 24px;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  margin-bottom: 32px;
`;

const SaveButton = styled.button<{ error?: boolean }>`
  ${BaseStyles}
  cursor: pointer;
  outline: none;
  color: ${({ error, theme: { colors } }) =>
    error ? colors.negative[100] : colors.primary[100]};
`;

const rotate = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

const Saving = styled.div`
  ${BaseStyles}
  animation: ${rotate} 2s infinite linear;
  color: ${({ theme: { colors } }) => colors.primary[100]};
`;

const Saved = styled.div`
  ${BaseStyles}
  color: ${({ theme: { colors } }) => colors.primary[25]};
`;
