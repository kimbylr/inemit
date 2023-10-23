'use client';

import { Menu } from '@/components/menu';
import { IconLogo } from '@/elements/icons/logo';
import Link from 'next/link';
import { FC, useLayoutEffect } from 'react';

export const Header: FC = () => {
  useLayoutEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = '#6CC17A';

    return () => {
      body.style.backgroundColor = '#f2f2f2';
    };
  }, []);

  return (
    <header
      className="w-full bg-gradient-to-b from-primary-100 to-primary-150 select-none flex justify-center shadow-[0_5px_15px_#00000066]"
      style={{ padding: 'max(env(safe-area-inset-top), 0.5rem) 0 0.5rem' }}
    >
      <Link
        href="/"
        className="text-grey-98 leading-none my-1 flex justify-center dotted-focus dotted-focus-white"
      >
        <IconLogo className="w-10" />
        <span className="font-massive text-xxl ml-4">inemit!</span>
      </Link>
      <div className="absolute top-4 right-4 z-40">
        <Menu />
      </div>
    </header>
  );
};
