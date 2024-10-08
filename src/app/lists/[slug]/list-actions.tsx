'use client';

import { IconEdit } from '@/elements/icons/edit';
import { IconLogo } from '@/elements/icons/logo';
import { IconSettings } from '@/elements/icons/settings';
import { IconStats } from '@/elements/icons/stats';
import { classNames } from '@/helpers/class-names';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';
import { useKey } from 'react-use';

type Tab = {
  name: string;
  path: string;
  icon: ReactNode;
  highlight?: boolean;
};

const TABS: Tab[] = [
  { name: 'Übersicht', path: '', icon: <IconStats className="size-5" /> },
  { name: 'Bearbeiten', path: `edit`, icon: <IconEdit className="size-[18px]" /> },
  { name: 'Einstellungen', path: 'settings', icon: <IconSettings className="size-5" /> },
  { name: 'Lernen', path: 'learn', icon: <IconLogo className="size-6" />, highlight: true },
];

export const ListActions: FC<{ slug: string }> = ({ slug }) => {
  const path = usePathname();
  const baseUrl = `/lists/${slug}`;
  const currentPath = path.replace(`${baseUrl}/`, '').replace(baseUrl, '');

  const { push } = useRouter();
  useKey('Enter', (e) => e.metaKey && push(`${baseUrl}/learn`));
  useKey('e', (e) => {
    !(e.target instanceof HTMLInputElement) && currentPath !== 'edit' && push(`${baseUrl}/edit`);
  });

  return (
    <div
      className={classNames(
        'z-40 pointer-events-none',
        'max-xs:w-screen max-xs:bottom-0 max-xs:fixed max-xs:-ml-6',
        'xs:sticky xs:top-1.5 xs:text-right',
      )}
    >
      <nav className="bg-white xs:rounded-lg inline-flex p-0 gap-0 justify-evenly xs:p-1 xs:gap-1 shadow max-xs:w-full pointer-events-auto">
        {TABS.map(({ name, path, icon, highlight }) => (
          <a
            href={`${baseUrl}/${path}`}
            key={name}
            className={classNames(
              // mobile + desktop
              'text-xxs flex items-center justify-center size-8 font-bold group relative flex-1',
              path === currentPath &&
                'bg-gradient-to-br from-primary-100 to-primary-150 text-white',
              path !== currentPath && !highlight && 'text-gray-60 hover:text-gray-25',
              path !== currentPath && highlight && 'text-primary-150',
              // desktop
              'xs:rounded',
              path !== currentPath && 'xs:hover:bg-gray-95',
              // mobile
              'max-xs:grow max-xs:w-auto max-xs:h-20 max-xs:flex-col max-xs:justify-evenly max-xs:pb-4 max-xs:pt-2',
            )}
          >
            {icon}
            {/* desktop */}
            <span className="hidden xs:group-focus-visible:flex xs:group-hover:flex absolute top-24 -left-14 text-gray-35 rotate-90 w-36">
              <span className="ml-0.5 bg-gray-90 text-left py-1 px-2 rounded">{name}</span>
            </span>
            {/* mobile */}
            <span className="xs:hidden text-[12px]">{name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};
