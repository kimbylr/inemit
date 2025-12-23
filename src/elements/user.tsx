'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { IconLogout } from './icons/logout';

type Props = {
  loggedInComponent?: ReactNode;
  loggedOutComponent?: ReactNode;
  navigateOnSpace?: boolean;
};

export const User: FC<Props> = ({ loggedInComponent, loggedOutComponent, navigateOnSpace }) => {
  const { isLoading, user } = useUser();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleNavigateOnSpace = (e: KeyboardEvent) => {
      if (
        navigateOnSpace &&
        e.key === ' ' &&
        ref.current?.contains(document.activeElement) &&
        document.activeElement?.tagName === 'A'
      ) {
        location.href = document.activeElement.getAttribute('href') || '';
      }
    };

    document.addEventListener('keydown', handleNavigateOnSpace);
    return () => document.removeEventListener('keydown', handleNavigateOnSpace);
  }, [navigateOnSpace]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <span ref={ref}>{loggedOutComponent || <a href={LOGIN_ROUTE}>Login</a>}</span>;
  }

  return (
    <span ref={ref}>
      {loggedInComponent || (
        <span className="flex gap-2 justify-between items-center text-gray-75 font-bold h-6">
          <span className="truncate">{user.email}</span>
          <a href={LOGOUT_ROUTE} aria-label="Logout" title="Logout" className="rounded-sm">
            <IconLogout className="w-11 h-11 -m-3 p-3 hover:text-gray-35" />
          </a>
        </span>
      )}
    </span>
  );
};

export const LOGIN_ROUTE = '/auth/login?returnTo=/lists';
export const LOGOUT_ROUTE = '/auth/logout';
