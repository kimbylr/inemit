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
    <nav className="pointer-events-none">
      {/* desktop */}
      <div className="max-xs:hidden sticky top-1.5 text-right">
        <div className="bg-white rounded-lg inline-flex justify-evenly p-1 gap-1 shadow max-xs:w-full pointer-events-auto">
          {TABS.map(({ name, path, icon, highlight }) => (
            <a
              href={`${baseUrl}/${path}`}
              key={name}
              className={classNames(
                'text-xxs flex items-center justify-center size-8 font-bold group relative flex-1 rounded',
                path === currentPath &&
                  'bg-gradient-to-br from-primary-100 to-primary-150 text-white',
                path !== currentPath && 'hover:bg-gray-95',
                path !== currentPath && !highlight && 'text-gray-60 hover:text-gray-25',
                path !== currentPath && highlight && 'text-primary-150',
              )}
            >
              {icon}
              <span className="hidden group-focus-visible:flex group-hover:flex absolute top-24 -left-14 text-gray-35 rotate-90 w-36">
                <span className="ml-0.5 bg-gray-90 text-left py-1 px-2 rounded">{name}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* mobile */}
      <div className="xs:hidden w-screen bottom-0 fixed -ml-6 z-40">
        <div className="bg-white inline-flex p-0 gap-0 justify-evenly shadow w-full pointer-events-auto border-t border-gray-85">
          {TABS.map(({ name, path, icon }) => (
            <a
              href={`${baseUrl}/${path}`}
              key={name}
              className={classNames(
                'text-xxs flex items-center size-8 font-bold group relative flex-1 grow w-auto h-24 flex-col justify-evenly pb-8 pt-2',
                path === currentPath && 'text-primary-150',
                path !== currentPath && 'text-gray-50',
              )}
            >
              {icon}
              <span className="xs:hidden text-[12px]">{name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
