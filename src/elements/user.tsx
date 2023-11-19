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
    return (
      <span ref={ref}>
        {loggedOutComponent || (
          <span className="bg-primary-50">
            <a href="/api/auth/login" className="dotted-focus">
              Login
            </a>
          </span>
        )}
      </span>
    );
  }

  return (
    <span ref={ref}>
      {loggedInComponent || (
        <span className="flex gap-2 justify-between items-center text-grey-75 font-bold">
          <span className="truncate">{user.email}</span>
          <a
            href="/api/auth/logout"
            aria-label="Logout"
            title="Logout"
            className="dotted-focus dotted-focus-rounded"
          >
            <IconLogout className="w-11 h-11 -m-3 p-3 hover:text-grey-35" />
          </a>
        </span>
      )}
    </span>
  );
};
