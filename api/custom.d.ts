import { Document } from 'mongoose';
import { ListType } from './models';

declare global {
  namespace Express {
    export interface Request {
      listLean?: ListType;
      list?: ListType & Document;
      itemIndex?: number;
      user?: {
        sub: string;
      };
    }
  }
}
