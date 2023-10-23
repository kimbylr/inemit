'use client';

import { User } from '@/elements/user';
import Link from 'next/link';
import { FC, ReactNode, useState } from 'react';

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <button
        className="h-12 w-12 rounded-full absolute -top-2 -right-2 p-2 dotted-focus dotted-focus-rounded dotted-focus-unspaced dotted-focus-white"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="border-2 border-white h-8 w-8 rounded-full relative">
          <span className="absolute w-3.5 h-0.5 rounded bg-white top-[8px] left-[7px]" />
          <span className="absolute w-3.5 h-0.5 rounded bg-white top-[13px] left-[7px]" />
          <span className="absolute w-3.5 h-0.5 rounded bg-white top-[18px] left-[7px]" />
        </div>
      </button>

      {open && (
        <ul className="absolute right-0 top-10 bg-white shadow-md w-56 rounded-lg flex flex-col text-grey-35 font-bold overflow-hidden">
          <li className="p-3">
            <User navigateOnSpace />
          </li>
          <MenuLink href="/lists" closeMenu={closeMenu}>
            Meine Listen
          </MenuLink>
          <MenuLink href="/about" closeMenu={closeMenu}>
            Über <em className="font-massive not-italic">inemit</em>
          </MenuLink>
        </ul>
      )}
    </>
  );
};

const MenuLink: FC<{ children: ReactNode; href: string; closeMenu: () => void }> = ({
  href,
  children,
  closeMenu,
}) => (
  <li className="border-t border-grey-85 hover:bg-grey-95">
    <Link href={href} className="p-3 block dotted-focus dotted-focus-unspaced" onClick={closeMenu}>
      {children}
    </Link>
  </li>
);
