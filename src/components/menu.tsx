'use client';

import { User } from '@/elements/user';
import { classNames } from '@/helpers/class-names';
import { List } from '@/types/types';
import Link from 'next/link';
import { FC, ReactNode, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

export const Menu: FC<{ lists: List[] }> = ({ lists }) => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  return (
    <div ref={ref}>
      <button
        className="h-12 w-12 absolute -top-2 -right-2 p-2 focus:outline-none group"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="border-2 border-transparent group-focus-visible:border-primary-25 group-focus-visible:group-hover:border-white h-8 w-8 rounded-lg relative">
          <span className="absolute w-4 h-0.5 rounded bg-primary-25 group-hover:bg-white top-[8px] left-1.5" />
          <span className="absolute w-4 h-0.5 rounded bg-primary-25 group-hover:bg-white top-[13px] left-1.5" />
          <span className="absolute w-4 h-0.5 rounded bg-primary-25 group-hover:bg-white top-[18px] left-1.5" />
        </div>
      </button>

      {open && (
        <ul className="absolute right-0 top-10 bg-white shadow-md w-56 rounded-lg flex flex-col text-gray-35 overflow-hidden">
          <li className="p-3">
            <User navigateOnSpace />
          </li>
          <MenuLink href="/lists" closeMenu={closeMenu}>
            <span className="font-bold">Meine Listen</span>
          </MenuLink>
          {lists.map(({ id, name, slug }) => (
            <MenuLink key={id} href={`/lists/${slug}`} closeMenu={closeMenu} noBorder>
              <span className="flex items-center">
                <span className="text-[10px] relative -top-1 mx-2">∟</span>
                <span className="truncate w-48 inline-block">{name}</span>
              </span>
            </MenuLink>
          ))}
          <MenuLink href="/about" closeMenu={closeMenu}>
            Über <em className="font-massive not-italic text-primary-150">inemit</em>
          </MenuLink>
        </ul>
      )}
    </div>
  );
};

type MenuLinkProps = {
  children: ReactNode;
  href: string;
  closeMenu: () => void;
  noBorder?: boolean;
};

const MenuLink: FC<MenuLinkProps> = ({ href, children, closeMenu, noBorder }) => (
  <li
    className={classNames(
      'border-gray-85 hover:bg-gray-95',
      !noBorder && 'border-t',
      noBorder && 'relative -top-1.5',
    )}
  >
    <Link
      href={href}
      className={classNames('p-3 block !-outline-offset-2 rounded-lg', noBorder && 'py-2')}
      onClick={closeMenu}
    >
      {children}
    </Link>
  </li>
);
