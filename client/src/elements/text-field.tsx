import React, { FC, InputHTMLAttributes } from 'react';

export const TextField: FC<
  {
    small?: boolean;
    label?: string;
    ref?: React.ForwardedRef<HTMLInputElement>;
  } & InputHTMLAttributes<HTMLInputElement>
> = React.forwardRef(({ small, className, label, ...props }, ref) => {
  const input = (
    <input
      className={`text-grey-10 font-light border-2 border-grey-85 outline-none rounded w-full bg-white appearance-none ${
        small ? 'text-xs p-1' : 'text-sm p-1.5'
      } ${
        label ? 'mb-1' : ''
      } focus:border-grey-50 transition-opacity duration-200 disabled:opacity-50 disabled:delay-200 disabled:cursor-not-allowed placeholder:text-grey-85 ${className}`}
      {...props}
      ref={ref}
    />
  );

  if (!label) {
    return input;
  }

  return (
    <label className="block font-bold text-xxs text-grey-60 uppercase">
      {input}
      {label}
    </label>
  );
});
