import React, { FC } from 'react';

const icons = {
  chevronDown: () => (
    <svg
      viewBox="0 8 32 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2px"
      width="100%"
    >
      <line x1="16" x2="7" y1="20.5" y2="11.5" />
      <line x1="25" x2="16" y1="11.5" y2="20.5" />
    </svg>
  ),
};

interface Props {
  type: keyof typeof icons;
}

export const Icon: FC<Props> = ({ type }) => {
  return icons[type]();
};
