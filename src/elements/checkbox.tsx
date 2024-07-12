'use client';

import { classNames } from '@/helpers/class-names';
import { FC, ReactNode } from 'react';
import { IconDone } from './icons/done';

type Props = {
  checked: boolean;
  onCheck(): void;
  small?: boolean;
  children: ReactNode;
};

export const Checkbox: FC<Props> = ({ children, checked, onCheck, small }) => (
  <label
    className={classNames(
      'cursor-pointer flex',
      small ? 'text-xxs items-end' : 'text-xs items-start',
    )}
  >
    <div className={classNames('pt-[1px] flex-shrink-0 relative', small ? 'w-5' : 'w-7')}>
      <input className="no-show peer" type="checkbox" checked={checked} onChange={onCheck} />
      <div
        className={classNames(
          'border-2 rounded-sm',
          'peer-focus-visible:outline peer-focus-visible:outline-primary-25 peer-focus-visible:outline-offset-2',
          small ? 'h-4 w-4' : 'h-5 w-5',
          checked ? 'border-primary-100 bg-primary-100' : 'border-gray-85 bg-white',
        )}
      />
      {checked && <CheckIcon small={small} />}
    </div>
    <span className="text-black">{children}</span>
  </label>
);

const CheckIcon: FC<{ small?: boolean }> = ({ small }) => (
  <div
    className={classNames(
      'absolute top-0.5 left-0.5 pointer-events-none text-white',
      small ? 'h-3 w-3' : 'h-4 w-4',
    )}
  >
    <IconDone />
  </div>
);
