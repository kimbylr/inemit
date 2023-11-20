'use client';

import { useHeight } from '@/hooks/use-height';
import { FC, ReactNode, useLayoutEffect } from 'react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const height = useHeight();

  useLayoutEffect(() => {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#000';
    () => document.getElementsByTagName('body')[0].style.removeProperty('background-color');
  }, []);

  return (
    <div
      className="w-[100vw] overflow-hidden fixed bg-grey-98 p-4"
      style={{ height: height + 'px' }}
    >
      {children}
    </div>
  );
};

export default Layout;
