import React, { FC, useState, ReactNode } from 'react';
import { Icon } from '../elements/icon';
import styled, { FlattenInterpolation, ThemeProps } from 'styled-components';
import { Collapse } from 'react-collapse';

interface Props {
  canExpand: boolean;
  teaser: ReactNode;
  teaserStyles?: FlattenInterpolation<ThemeProps<any>>;
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const ExpandableArea: FC<Props> = ({
  canExpand = true,
  children,
  teaser,
  teaserStyles,
  state: externalState,
}) => {
  const internalState = useState<boolean>(false);
  const [open, setOpen] = externalState || internalState;
  const toggle = () => setOpen(!open);

  return (
    <Container>
      <ToggleButton
        isOpened={open}
        onClick={canExpand ? toggle : undefined}
        additionalStyles={teaserStyles || ''}
      >
        {teaser}
        {canExpand && (
          <ToggleButtonIcon isOpened={open}>
            <Icon type="chevronDown" />
          </ToggleButtonIcon>
        )}
      </ToggleButton>

      <Collapse isOpened={open}>{children}</Collapse>
    </Container>
  );
};

const Container = styled.section`
  .ReactCollapse--collapse {
    transition: height 0.2s;
  }
`;

interface ToggleButtonProps {
  isOpened: boolean;
  additionalStyles: FlattenInterpolation<ThemeProps<any>> | string;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  outline: none; /* TODO */
  cursor: pointer;
  border: none;
  background: none;
  margin: 0 auto;
  padding: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ additionalStyles }) => additionalStyles}
`;

const ToggleButtonIcon = styled.div<{ isOpened: boolean }>`
  margin-left: 0.5rem;
  position: relative;
  width: 30px;
  height: 30px;
  top: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  transform: rotate(${({ isOpened }) => (isOpened ? '-180' : '0')}deg);
  transition: transform 0.2s ease-in-out;
`;
