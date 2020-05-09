import * as cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();
const corsWhitelist = process.env.CORS_WHITELIST.split(',');

export const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (corsWhitelist.includes(origin)) {
      cb(null, true);
    } else {
      console.warn(`CORS error -- origin: ${origin}`);
      cb(new Error('Not allowed by CORS'));
    }
  },
});
