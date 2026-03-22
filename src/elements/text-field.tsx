'use client';

import { classNames } from '@/helpers/class-names';
import React, { FC, InputHTMLAttributes, useRef } from 'react';
import { IconCrossCircle } from './icons/cross-circle';

export const TextField: FC<
  {
    small?: boolean;
    label?: string;
    clearable?: boolean;
    onClear?: () => void;
    ref?: React.RefObject<HTMLInputElement | null>;
  } & InputHTMLAttributes<HTMLInputElement>
> = ({ small, className, label, clearable, onClear, ref: propsRef, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = propsRef || inputRef;

  const input = (
    <input
      className={classNames(
        'text-black font-light border-2 border-gray-85 outline-none rounded w-full bg-white appearance-none',
        small ? 'text-xs p-1' : 'text-sm p-1.5',
        label && 'mb-1',
        'focus:border-gray-50 transition-opacity duration-200 disabled:opacity-50 disabled:delay-200 disabled:cursor-not-allowed placeholder:text-gray-85',
        className,
      )}
      {...props}
      ref={ref}
      name={`1pw-escape-hatch--search`}
    />
  );

  if (!label && !clearable) {
    return input;
  }

  return (
    <label className="block font-bold text-xxs text-gray-60 uppercase relative">
      {input}
      {label}
      {clearable && props.value !== '' && (
        <button
          className="absolute right-1 w-6 inset-y-1 p-1 text-gray-85 hover:text-gray-60"
          type="reset"
          onClick={() => {
            onClear?.();
            ref.current?.focus();
          }}
        >
          <IconCrossCircle />
        </button>
      )}
    </label>
  );
};
