import React, { FC, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useAuth } from './auth';

// component adapted from auth0
export const PrivateRoute: FC<{ redirectTo?: string }> = ({ children, redirectTo }) => {
  const { loading, user, login } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const fn = async () => {
        await login({ appState: { targetUrl: redirectTo } });
      };

      fn();
    }
  }, [loading, user, login, redirectTo]);

  return user ? <>{children}</> : null;
};
