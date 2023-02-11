import { FC, ReactNode } from 'react';

export const PageLayout: FC<{ width?: 'wide' | 'tight'; children: ReactNode }> = ({
  children,
  width = 'tight',
}) => (
  <div className={`mx-auto sm:mt-4 ${width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'}`}>
    {children}
  </div>
);
