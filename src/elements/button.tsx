'use client';

import { classNames } from '@/helpers/class-names';
import React, { ButtonHTMLAttributes } from 'react';

type Props = {
  primary?: boolean;
  caution?: boolean;
  small?: boolean;
  ref?: React.ForwardedRef<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ primary, caution, small, children, className = '', ...props }, ref) => (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2',
        'leading-terse uppercase whitespace-nowrap font-bold',
        'relative select-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'rounded mb-1 active:shadow-none active:top-1',
        'button-focus',
        small ? 'text-xxs py-[5px] px-3' : 'text-xs py-2 px-4',
        primary &&
          'bg-primary-100 text-gray-98 hover:text-gray-25 active:text-gray-25 active:bg-primary-150 button-focus-primary shadow-button-primary',
        !primary && 'text-gray-25 hover:text-gray-98 active:text-gray-98',
        !primary &&
          (caution
            ? 'bg-negative-75 active:bg-negative-200 button-focus-caution shadow-button-caution'
            : 'bg-gray-85 active:bg-gray-85 button-focus-secondary shadow-button-secondary'),
        className,
      )}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  ),
);
