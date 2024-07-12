'use client';

import { classNames } from '@/helpers/class-names';
import { FC } from 'react';

type Props = {
  enabled: boolean;
  onToggle: () => void;
};

export const Switch: FC<Props> = ({ enabled, onToggle }) => (
  <button
    type="button"
    className={classNames(
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-primary',
      enabled ? 'bg-primary-150' : 'bg-gray-85',
    )}
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
        enabled ? 'translate-x-5' : 'translate-x-0',
      )}
    />
  </button>
);
