'use client';

import { useHeight } from '@/hooks/use-height';
import { FC, ReactNode, useLayoutEffect } from 'react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const height = useHeight();

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
