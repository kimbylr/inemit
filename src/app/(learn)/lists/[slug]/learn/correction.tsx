import { classNames } from '@/helpers/class-names';
import React from 'react';
import { TextWithBreaks } from './text-with-breaks';

type CorrectionProps = {
  onClick?: (event: React.MouseEvent) => Promise<void>;
  disabled?: boolean;
  children: string;
  ref?: React.ForwardedRef<HTMLButtonElement | any>;
};

export const Correction = React.forwardRef<HTMLButtonElement, CorrectionProps>(
  ({ onClick, disabled, children }, ref) => {
    const Element = onClick ? 'button' : 'div';
    const triangleClasses =
      'absolute top-[100%] left-[50%] border-transparent border-solid h-0 w-0 pointer-events-none';

    return (
      <Element
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        disabled={disabled}
        ref={ref as any}
        className={classNames(
          'min-w-[50%] max-w-full rounded p-2 break-when-needed leading-tight relative text-sm',
          onClick
            ? 'bg-primary-10 border-[3px] border-primary-100 text-primary-100 font-bold'
            : 'bg-gray-95 border-2 border-gray-50 text-gray-25 font-light',
          'outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {/* triangle border */}
        <span
          className={classNames(
            triangleClasses,
            onClick
              ? 'border-t-primary-100 border-[16px] -ml-4'
              : 'border-t-gray-50 border-[15px] ml-[-15px]',
          )}
        />
        {/* triangle fill */}
        <span
          className={classNames(
            triangleClasses,
            'border-[12px] -ml-3',
            onClick ? 'border-t-primary-10' : 'border-t-gray-95',
          )}
        />
        <TextWithBreaks>{children}</TextWithBreaks>
      </Element>
    );
  },
);
