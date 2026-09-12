import { classNames } from '@/helpers/class-names';
import React from 'react';
import { TextWithBreaks } from './text-with-breaks';

type CorrectionProps = {
  variant: 'correct' | 'neutral' | 'warning';
  onClick?: (event: React.MouseEvent) => Promise<void>;
  disabled?: boolean;
  children: string;
  ref?: React.ForwardedRef<HTMLButtonElement | any>;
};

export const Correction = React.forwardRef<HTMLButtonElement, CorrectionProps>(
  ({ variant, onClick, disabled, children }, ref) => {
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
          'min-w-[50%] max-w-full rounded p-2 break-when-needed leading-tight relative',
          'outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'warning' ? 'text-xs' : 'text-sm',
          variant === 'neutral' ? 'font-light' : 'font-bold',

          variant === 'correct' && 'bg-primary-10 border-[3px] border-primary-100 text-primary-100',
          variant === 'neutral' && 'bg-gray-95 border-2 border-gray-50 text-gray-25',
          variant === 'warning' && 'bg-orange-10 border-orange-100 border-2 text-orange-200',
        )}
      >
        {/* triangle border */}
        <span
          className={classNames(
            triangleClasses,
            variant === 'correct' && 'border-t-primary-100 border-[16px] -ml-4',
            variant === 'neutral' && 'border-t-gray-50 border-[15px] ml-[-15px]',
            variant === 'warning' && 'border-t-orange-50 border-[15px] ml-[-15px]',
          )}
        />
        {/* triangle fill */}
        <span
          className={classNames(
            triangleClasses,
            'border-[12px] -ml-3',
            variant === 'correct' && 'border-t-primary-10',
            variant === 'neutral' && 'border-t-gray-95',
            variant === 'warning' && 'border-t-orange-10',
          )}
        />
        <TextWithBreaks>{children}</TextWithBreaks>
      </Element>
    );
  },
);
