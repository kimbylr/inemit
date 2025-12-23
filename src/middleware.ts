import type { NextRequest } from 'next/server';
import { auth0 } from './services/auth0';

/*
Automatically mounts authentication routes:
  /auth/login - Login route
  /auth/logout - Logout route
  /auth/callback - Callback route
  /auth/profile - User profile route
  /auth/access-token - Access token route
  /auth/backchannel-logout - Backchannel logout route
*/
export const middleware = async (request: NextRequest) => auth0.middleware(request);

export const config = {
  matcher: ['/lists/:path*', '/auth/:path*', '/ui'],
};
