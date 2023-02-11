import React, { FC, useState, ReactNode, useEffect, useRef } from 'react';
import { Icon } from '../elements/icon';
import styled, { FlattenInterpolation, ThemeProps } from 'styled-components';
import { Collapse } from 'react-collapse';

interface Props {
  canExpand?: boolean;
  showChevronButton?: boolean;
  teaser?: ReactNode;
  teaserStyles?: FlattenInterpolation<ThemeProps<any>>;
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  children: ReactNode;
}

export const ExpandableArea: FC<Props> = ({
  canExpand = true,
  showChevronButton = true,
  children,
  teaser,
  teaserStyles,
  state: externalState,
}) => {
  const internalState = useState<boolean>(false);
  const [open, setOpen] = externalState || internalState;
  const toggle = () => setOpen(!open);

  // handle removing/adding tabIndex on collapse/expand
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current
      ?.querySelectorAll(FOCUSABLE_ELEMENTS.join(', '))
      .forEach((el) => el.setAttribute('tabindex', open ? '0' : '-1'));
  }, [open]);

  if (showChevronButton) {
    return (
      <Container>
        <ToggleButton
          flexed
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

        <Collapse isOpened={open}>
          <div ref={ref}>{children}</div>
        </Collapse>
      </Container>
    );
  }

  return (
    <Container>
      <ToggleButton
        isOpened={open}
        additionalStyles={teaserStyles || ''}
        onClick={canExpand ? toggle : undefined}
      >
        {teaser}
      </ToggleButton>

      <Collapse isOpened={open}>{children}</Collapse>
    </Container>
  );
};

const FOCUSABLE_ELEMENTS = ['a', 'button', 'input', 'textarea', '[tabindex]'];

const Container = styled.section`
  .ReactCollapse--collapse {
    transition: height 0.2s;
  }
`;

interface ToggleButtonProps {
  isOpened: boolean;
  flexed?: boolean;
  additionalStyles: FlattenInterpolation<ThemeProps<any>> | string;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  cursor: pointer;
  border: none;
  background: none;
  margin: 0;
  padding: 0;

  ${({ flexed }) =>
    flexed
      ? ` display: flex;
          justify-content: space-between;
          align-items: center;`
      : 'width: 100%;'}

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
