import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin(() => ({
    returnTo: `${process.env.AUTH0_BASE_URL}/lists`,
  })),
  onError(req: Request, error: Error) {
    console.error(error);
  },
});
