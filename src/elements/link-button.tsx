'use client';

import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export const LinkButton: FC<Props> = ({ children, onClick }) => (
  <button onClick={onClick} className="underline text-gray-50 hover:text-primary-150 font-bold">
    {children}
  </button>
);
