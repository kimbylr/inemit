'use client';

import { FC } from 'react';

type Props = {
  enabled: boolean;
  onToggle: () => void;
};

export const Switch: FC<Props> = ({ enabled, onToggle }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out dotted-focus ${
      enabled ? 'bg-primary-150' : 'bg-grey-85'
    }`}
    role="switch"
    aria-checked="false"
    onClick={onToggle}
  >
    <span className="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);
