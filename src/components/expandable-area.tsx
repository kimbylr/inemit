'use client';

import { IconChevronDown } from '@/elements/icons/chevron-down';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Collapse } from 'react-collapse';

interface Props {
  canExpand?: boolean;
  showChevronButton?: boolean;
  teaser?: ReactNode;
  teaserStyles?: string;
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  children: ReactNode;
}

export const ExpandableArea: FC<Props> = ({
  canExpand = true,
  showChevronButton = true,
  children,
  teaser,
  teaserStyles = '',
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
      <section>
        <button
          className={`w-full flex justify-center items-center ${teaserStyles} dotted-focus dotted-focus-dark`}
          onClick={canExpand ? toggle : undefined}
        >
          {teaser}
          {canExpand && (
            <div
              className={`ml-2 relative w-8 h-8 top-0.5 flex flex-col justify-center transition-transform ${
                open ? '-rotate-180' : 'rotate-0'
              }`}
            >
              <IconChevronDown />
            </div>
          )}
        </button>

        <Collapse isOpened={open}>
          <div ref={ref}>{children}</div>
        </Collapse>
      </section>
    );
  }

  return (
    <section>
      <button
        className={`w-full flex justify-center items-center ${teaserStyles} dotted-focus dotted-focus-dark`}
        onClick={canExpand ? toggle : undefined}
      >
        {teaser}
      </button>

      <Collapse isOpened={open}>{children}</Collapse>
    </section>
  );
};

const FOCUSABLE_ELEMENTS = ['a', 'button', 'input', 'textarea', '[tabindex]'];
