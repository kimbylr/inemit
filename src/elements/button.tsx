'use client';

import React, { ButtonHTMLAttributes, FC } from 'react';

const baseClasses =
  'leading-terse inline-flex items-center justify-center gap-2 uppercase whitespace-nowrap font-bold relative select-none outline-none rounded disabled:opacity-50 disabled:cursor-not-allowed mb-1';

type Props = {
  primary?: boolean;
  caution?: boolean;
  small?: boolean;
  ref?: React.ForwardedRef<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ primary, caution, small, children, className = '', ...props }, ref) => {
    const primaryClasses =
      'bg-primary-100 text-gray-98 shadow-button-primary hover:text-gray-25 active:text-gray-25 active:bg-primary-150 button-focus-primary';
    const secondaryAndCaution =
      'text-gray-25 hover:text-gray-98 active:text-gray-98 button-focus-secondary';
    const secondaryClasses = `bg-gray-85 shadow-button-secondary active:bg-gray-85 ${secondaryAndCaution}`;
    const cautionClasses = `bg-negative-75 shadow-button-caution active:bg-negative-150 ${secondaryAndCaution}`;

    return (
      <button
        className={`${baseClasses} active:shadow-none active:top-1 button-focus ${
          small ? 'text-xxs py-[5px] px-3' : 'text-xs py-2 px-4'
        }  ${caution ? cautionClasses : primary ? primaryClasses : secondaryClasses} ${className}`}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);
