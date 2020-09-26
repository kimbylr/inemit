import React, { FC, useState, ReactNode } from 'react';
import { Icon } from '../elements/icon';
import styled, { keyframes, css } from 'styled-components';

interface Props {
  saved: boolean;
  saving: boolean;
  canSave: boolean;
  error: string | null;
  isNew?: boolean;
  submit: (event: React.MouseEvent) => Promise<void>;
}

export const EditStatus: FC<Props> = ({
  saving,
  saved,
  canSave,
  error,
  isNew,
  submit,
}) => {
  if (saving) {
    return (
      <Saving title="speichern...">
        <Icon type="syncInCircle" />
      </Saving>
    );
  }

  if (error) {
    return (
      <SaveButton
        type="submit"
        error
        onClick={submit}
        tabIndex={-1}
        title={error}
      >
        <Icon type="attention" />
      </SaveButton>
    );
  }

  if (saved) {
    return (
      <Saved title="gespeichert">
        <Icon type="ok" />
      </Saved>
    );
  }

  return (
    <SaveButton
      type="submit"
      onClick={submit}
      tabIndex={-1}
      title="speichern"
      disabled={!canSave} // new items
    >
      <Icon type={isNew ? 'new' : 'ok'} />
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

const SaveButton = styled.button<{ error?: boolean }>`
  ${BaseStyles}
  ${({ disabled }) => (disabled ? '' : 'cursor: pointer;')}
  outline: none;
  color: ${({ disabled, error, theme: { colors } }) =>
    disabled
      ? colors.grey[85]
      : error
      ? colors.negative[100]
      : colors.primary[100]};
`;
