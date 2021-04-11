import createAuth0Client, { RedirectLoginOptions } from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import React, { FC, useContext, useEffect, useState } from 'react';

const AUTH_DOMAIN = process.env.AUTH_DOMAIN ?? '';
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID ?? '';
const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;
const REDIRECT_URI = window.location.origin;

const noop = () => {};

interface AuthContextData {
  user: object | null;
  loading: boolean;
  login(options?: RedirectLoginOptions): Promise<void>;
  getToken(): Promise<string>;
  logout(): void;
}

const initialData = {
  user: null,
  loading: true,
  login: async () => {},
  getToken: async () => '',
  logout: noop,
};

export const AuthContext = React.createContext<AuthContextData>(initialData);
export const useAuth = () => useContext(AuthContext);

// component adapted from auth0
export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  // const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client({
        domain: AUTH_DOMAIN,
        client_id: AUTH_CLIENT_ID,
        audience: AUTH_AUDIENCE,
        redirect_uri: REDIRECT_URI,
      });

      setAuth0Client(auth0FromHook);

      if (window.location.search.includes('code=')) {
        /*const { appState } =*/ await auth0FromHook.handleRedirectCallback();
        // onRedirectCallback(appState);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      if (isAuthenticated) {
        const authUser = await auth0FromHook.getUser();
        setUser(authUser || null);
      }

      setLoading(false);
    };

    initAuth0();
  }, []);

  // const loginWithPopup = async (params = {}) => {
  //   setPopupOpen(true);
  //   try {
  //     await auth0Client?.loginWithPopup(params);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setPopupOpen(false);
  //   }
  //   const loginUser = await auth0Client?.getUser();
  //   setUser(loginUser);
  // };

  // const handleRedirectCallback = async () => {
  //   setLoading(true);
  //   await auth0Client?.handleRedirectCallback();
  //   const loginUser = await auth0Client?.getUser();
  //   setUser(loginUser);
  //   setLoading(false);
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: (options?: RedirectLoginOptions) =>
          auth0Client?.loginWithRedirect(options) ?? ((noop as unknown) as any),
        getToken: () => auth0Client?.getTokenSilently() ?? ((noop as unknown) as any),
        logout: () => auth0Client?.logout({ returnTo: REDIRECT_URI }) ?? noop,
        // popupOpen,
        // loginWithPopup,
        // handleRedirectCallback,
        // getIdTokenClaims: () => auth0Client?.getIdTokenClaims(),
        // getTokenWithPopup: () => auth0Client?.getTokenWithPopup(),
        // logout: (...p: any) => auth0Client?.logout(...p),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
