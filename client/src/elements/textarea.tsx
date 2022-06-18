import { FC, TextareaHTMLAttributes } from 'react';

export const Textarea: FC<
  { className?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ children, className = '', ...props }) => (
  <textarea
    className={`text-grey-10 text-xs border-2 border-grey-85 outline-none p-1.5 rounded w-full bg-white transition-opacity duration-200 focus:border-grey-50 disabled:opacity-50 disabled:delay-200 disabled:cursor-not-allowed placeholder:text-grey-85 ${className}`}
    {...props}
  >
    {children}
  </textarea>
);
