import React, { ButtonHTMLAttributes, FC } from 'react';

const baseClasses =
  'leading-terse inline-flex items-center justify-center gap-2 uppercase whitespace-nowrap font-bold relative select-none outline-none rounded disabled:opacity-50 disabled:cursor-not-allowed mb-1';

export const Button: FC<
  {
    primary?: boolean;
    caution?: boolean;
    small?: boolean;
    ref?: React.ForwardedRef<HTMLButtonElement>;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = React.forwardRef(({ primary, caution, small, children, className = '', ...props }, ref) => {
  const primaryClasses =
    'bg-primary-100 text-grey-98 shadow-button-primary hover:text-grey-25 active:text-grey-25 active:bg-primary-150 button-focus-primary';
  const secondaryAndCaution =
    'text-grey-25 hover:text-grey-98 active:text-grey-98 button-focus-secondary';
  const secondaryClasses = `bg-grey-85 shadow-button-secondary active:bg-grey-85 ${secondaryAndCaution}`;
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
});

export const OutlineButton: FC<
  {
    caution?: boolean;
    ref?: React.ForwardedRef<HTMLButtonElement>;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = React.forwardRef(({ caution, children, className = '', ...props }, ref) => {
  const primaryClasses =
    'text-grey-98 shadow-button-primary hover:text-grey-25 active:text-grey-25 active:bg-primary-150 button-focus-primary';
  const cautionClasses = `active:bg-negative-150 text-grey-25 hover:text-grey-98 active:text-grey-98 button-focus-secondary`;

  return (
    <button
      className={`${baseClasses} text-xs py-2 px-4 border hover:text-grey-25 hover:border-grey-25 dotted-focus dotted-focus-dark ${
        caution ? 'text-negative-150 border-negative-150' : 'text-primary-150 border-primary-150'
      } ${className}`}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  );
});
