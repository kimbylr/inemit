import { FC, TextareaHTMLAttributes } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: FC<Props> = ({ children, ...props }) => (
  <textarea
    className="text-black text-xs border-2 border-gray-85 outline-none p-1.5 rounded w-full bg-white transition-opacity duration-200 focus:border-gray-50 disabled:opacity-50 disabled:delay-200 disabled:cursor-not-allowed placeholder:text-gray-85"
    {...props}
  >
    {children}
  </textarea>
);
