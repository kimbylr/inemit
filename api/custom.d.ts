import { Document } from 'mongoose';
import { LearnItemType, ListType } from './models';

declare global {
  namespace Express {
    export interface Request {
      listLean?: ListType;
      list?: ListType & Document;
      item?: LearnItemType;
      user?: {
        sub: string;
      };
    }
  }
}
