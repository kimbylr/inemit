import React, { ButtonHTMLAttributes, FC } from 'react';

export const Button: FC<
  {
    primary?: boolean;
    caution?: boolean;
    small?: boolean;
    ref?: React.ForwardedRef<HTMLButtonElement>;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = React.forwardRef(
  ({ primary, caution, small, children, className = '', ...props }, ref) => {
    const baseClasses =
      'leading- inline-flex items-center justify-center gap-2 uppercase whitespace-nowrap font-bold relative select-none outline-none rounded mb-1 active:shadow-none active:top-1 disabled:opacity-50 disabled:cursor-not-allowed button-focus';
    const primaryClasses =
      'bg-primary-100 text-grey-98 shadow-button-primary hover:text-grey-25 active:text-grey-25 active:bg-primary-150 button-focus-primary';
    const secondaryAndCaution =
      'text-grey-25 hover:text-grey-98 active:text-grey-98 button-focus-secondary';
    const secondaryClasses = `bg-grey-85 shadow-button-secondary active:bg-grey-85 ${secondaryAndCaution}`;
    const cautionClasses = `bg-negative-75 shadow-button-caution active:bg-negative-150 ${secondaryAndCaution}`;

    return (
      <button
        className={`${baseClasses} leading-terse ${
          small ? 'text-xxs py-[5px] px-3' : 'text-xs py-2 px-4'
        }  ${
          caution ? cautionClasses : primary ? primaryClasses : secondaryClasses
        } ${className}`}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);
