import { ListType } from './models';

declare global {
  namespace Express {
    export interface Request {
      list?: ListType;
      itemIndex?: number;
      user?: {
        sub: string;
      };
    }
  }
}
