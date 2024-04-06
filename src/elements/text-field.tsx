import React, { FC, InputHTMLAttributes } from 'react';

export const TextField: FC<
  {
    small?: boolean;
    label?: string;
    ref?: React.LegacyRef<HTMLInputElement>;
  } & InputHTMLAttributes<HTMLInputElement>
> = React.forwardRef(({ small, className, label, ...props }, ref) => {
  const input = (
    <input
      className={`text-black font-light border-2 border-gray-85 outline-none rounded w-full bg-white appearance-none ${
        small ? 'text-xs p-1' : 'text-sm p-1.5'
      } ${
        label ? 'mb-1' : ''
      } focus:border-gray-50 transition-opacity duration-200 disabled:opacity-50 disabled:delay-200 disabled:cursor-not-allowed placeholder:text-gray-85 ${className}`}
      {...props}
      ref={ref}
      name={`1pw-escape-hatch--search`}
    />
  );

  if (!label) {
    return input;
  }

  return (
    <label className="block font-bold text-xxs text-gray-60 uppercase">
      {input}
      {label}
    </label>
  );
});
