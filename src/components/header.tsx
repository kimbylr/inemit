'use client';

import { Menu } from '@/components/menu';
import { IconLogo } from '@/elements/icons/logo';
import { List } from '@/types/types';
import Link from 'next/link';
import { FC } from 'react';

export const Header: FC<{ lists: List[] }> = ({ lists }) => (
  <header
    className="w-full bg-gradient-to-b from-primary-100 to-primary-150 select-none flex justify-center shadow-[0_5px_15px_#00000066]"
    style={{ padding: 'max(env(safe-area-inset-top), 0.5rem) 0 0.5rem' }}
  >
    <div className="absolute top-4 left-4 text-gray-98 sm:hidden">
      <IconLogo className="w-10" />
    </div>

    <Link
      href="/"
      className="text-gray-98 leading-none my-1 flex justify-center dotted-focus dotted-focus-white"
    >
      <IconLogo className="w-10 hidden sm:block" />
      <span className="font-massive text-xxl ml-4">inemit!</span>
    </Link>

    <div className="absolute top-4 right-4 z-40">
      <Menu lists={lists} />
    </div>
  </header>
);
