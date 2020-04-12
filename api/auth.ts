import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as dotenv from 'dotenv';

dotenv.config();
const { AUTH_ISSUER, AUTH_AUDIENCE } = process.env;

// Auth0 configuration
const authConfig = {
  issuer: AUTH_ISSUER,
  audience: AUTH_AUDIENCE,
  algorithm: ['RS256'],
};

// cache public key of the auth server to verify token
const secret = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${authConfig.issuer}.well-known/jwks.json`,
});

export const auth = jwt({ secret, ...authConfig });
