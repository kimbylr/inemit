import { Document, Schema, model } from 'mongoose';

export interface ProgressType extends Document {
  due: Date;
  stage: number;
  interval: number;
  easiness: number;
  timesCorrect: number;
  timesWrong: number;
  updated: Date;
}

const ProgressSchema = new Schema<ProgressType>({
  due: { type: Date, default: Date.now },
  stage: { type: Number, default: 1 },
  interval: { type: Number, default: 1 },
  easiness: { type: Number, default: 2.5 },
  timesCorrect: { type: Number, default: 0 },
  timesWrong: { type: Number, default: 0 },
  updated: { type: Date, default: Date.now },
});

export const Progress = model<ProgressType>('Progress', ProgressSchema);

// ================

export interface UnsplashImage {
  id: string;
  urls: { thumb: string; small: string; regular: string };
  user: { name: string; link: string };
}
const UnsplashImageSchema = new Schema<UnsplashImage>({
  id: { type: String, required: true },
  urls: {
    thumb: { type: String, required: true },
    small: { type: String, required: true },
    regular: { type: String, required: true },
  },
  user: {
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
});

export interface LearnItemType extends Document {
  created: Date;
  updated: Date;
  prompt: string;
  solution: string;
  flagged?: boolean;
  image?: UnsplashImage | null;
  progress: ProgressType;
}

const LearnItemSchema = new Schema<LearnItemType>({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  prompt: { type: String, required: true },
  solution: { type: String, required: true },
  flagged: Boolean,
  image: UnsplashImageSchema,
  progress: { type: ProgressSchema, default: new Progress() },
});

export const LearnItem = model<LearnItemType>('LearnItem', LearnItemSchema);

// ================

export interface ListType extends Document {
  userId: string;
  name: string;
  slug: string;
  created: Date;
  updated: Date;
  items: LearnItemType[];
}

const ListSchema = new Schema<ListType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  items: [LearnItemSchema],
});

export const List = model<ListType>('LearnList', ListSchema);
