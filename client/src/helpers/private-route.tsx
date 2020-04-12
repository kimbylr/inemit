import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useAuth } from './auth';

// component adapted from auth0
export const PrivateRoute = ({ component: Component, path, ...rest }: any) => {
  const { loading, user, login } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const fn = async () => {
        await login({ appState: { targetUrl: path } });
      };

      fn();
    }
  }, [loading, user, login, path]);

  const render = (props: any) => (user ? <Component {...props} /> : null);

  return <Route path={path} render={render} {...rest} />;
};
