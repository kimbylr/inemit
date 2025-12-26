'use client';

import { User } from '@/elements/user';
import { classNames } from '@/helpers/class-names';
import { List } from '@/types/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, ReactNode, useRef, useState } from 'react';
import { useClickAway, useKey } from 'react-use';

export const Menu: FC<{ lists: List<'lastLearnt' | 'progress'>[] }> = ({ lists }) => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  useKey('Escape', () => {
    setOpen(false);
    buttonRef.current?.focus();
  });

  const path = usePathname();
  const currentSlug = path.split('/').at(2);

  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  return (
    <div ref={ref}>
      <button
        className="h-12 w-12 absolute -top-2 -right-2 p-2 focus:outline-none group"
        onClick={() => setOpen((o) => !o)}
        ref={buttonRef}
      >
        <div className="border-2 border-transparent group-focus-visible:border-primary-25 group-focus-visible:group-hover:border-white h-8 w-8 rounded-lg relative">
          <span className="absolute w-4 h-0.5 rounded bg-primary-25 group-hover:bg-white top-[8px] left-1.5" />
          <span className="absolute w-4 h-0.5 rounded bg-primary-25 group-hover:bg-white top-[13px] left-1.5" />
          <span className="absolute w-4 h-0.5 rounded bg-primary-25 group-hover:bg-white top-[18px] left-1.5" />
        </div>
      </button>

      {open && (
        <ul className="absolute right-0 top-10 bg-white shadow-md w-56 rounded-lg flex flex-col text-gray-35 overflow-hidden">
          <li className="p-3 h-12">
            <User navigateOnSpace />
          </li>
          <MenuLink href="/lists" closeMenu={closeMenu}>
            <span className="font-bold">Meine Listen</span>
          </MenuLink>
          {lists.map(({ id, name, slug, progress }) => (
            <MenuLink
              key={id}
              href={`/lists/${slug}`}
              closeMenu={closeMenu}
              isCurrent={slug === currentSlug}
              noBorder
            >
              <span className="truncate w-full flex gap-2.5 items-center">
                {name}
                {progress.dueToday > 0 && (
                  <span className="bg-primary-150 text-white text-[12px] flex rounded-full items-center justify-center px-2 py-px">
                    {progress.dueToday}
                  </span>
                )}
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
  isCurrent?: boolean;
};

const MenuLink: FC<MenuLinkProps> = ({ href, children, closeMenu, noBorder, isCurrent }) => {
  const className = classNames('p-3 block !-outline-offset-2 rounded-lg', noBorder && 'py-2');

  return (
    <li
      className={classNames(
        'border-gray-85',
        !noBorder && 'border-t',
        isCurrent ? 'bg-primary-5' : 'hover:bg-primary-5',
      )}
    >
      {isCurrent ? (
        <span className={className}>{children}</span>
      ) : (
        <Link href={href} className={className} onClick={closeMenu}>
          {children}
        </Link>
      )}
    </li>
  );
};
