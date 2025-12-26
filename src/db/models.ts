import { Stage, UnsplashImage } from '@/types/types';
import { Document, Model, ObjectId, Schema, model } from 'mongoose';

// prevent double compilation during development
type GenericModel<T> = Model<
  T,
  {},
  {},
  {},
  Document<unknown, {}, T> & Omit<T & { _id: ObjectId }, never>,
  any
>;

if (!(global as any).models) {
  (global as any).models = {};
}

let cached = (global as any).models as {
  init: boolean;
  Progress: GenericModel<ProgressType>;
  LearnItem: GenericModel<LearnItemType>;
  List: GenericModel<ListType & Document>;
  Settings: GenericModel<SettingsType & Document>;
};

// ================

export interface ProgressType extends Document {
  due: Date;
  stage: Stage;
  interval: number;
  easiness: number;
  timesCorrect: number;
  timesWrong: number;
  updated: Date;
}

const ProgressSchema = new Schema<ProgressType>({
  due: { type: Date, default: () => new Date() },
  stage: { type: Number, default: 1 },
  interval: { type: Number, default: 1 },
  easiness: { type: Number, default: 2.5 },
  timesCorrect: { type: Number, default: 0 },
  timesWrong: { type: Number, default: 0 },
  updated: { type: Date, default: () => new Date() },
});

if (!cached.Progress) {
  cached.Progress = model<ProgressType>('Progress', ProgressSchema);
}

// ================

const UnsplashImageSchema = new Schema<UnsplashImage>({
  id: { type: String, required: true },
  width: Number,
  height: Number,
  color: String,
  blurHash: String,
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
  promptAddition?: string;
  solution: string;
  flagged?: boolean;
  image?: UnsplashImage | null;
  progress: ProgressType;
}

const LearnItemSchema = new Schema<LearnItemType>({
  created: { type: Date, default: () => new Date() },
  updated: { type: Date, default: () => new Date() },
  prompt: { type: String, required: true },
  promptAddition: String,
  solution: { type: String, required: true },
  flagged: Boolean,
  image: UnsplashImageSchema,
  progress: { type: ProgressSchema, default: new cached.Progress() },
});

// ================

export interface ListType {
  userId: string;
  name: string;
  slug: string;
  learnCount?: number;
  repeat?: boolean;
  created: Date;
  updated: Date;
  items: LearnItemType[];
  _id: any; // from document
}

const ListSchema = new Schema<ListType & Document>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  learnCount: Number,
  repeat: { type: Boolean, default: true },
  created: { type: Date, default: () => new Date() },
  updated: { type: Date, default: () => new Date() },
  items: [LearnItemSchema],
});

// ================

export const HINTS = {
  editingIntro: false,
  learningFalseNegative: false,
  learningFlag: false,
};

export interface SettingsType {
  userId: string;
  updated: Date;
  dismissedHints: typeof HINTS;
}

const SettingsSchema = new Schema<SettingsType & Document>({
  userId: { type: String, required: true },
  updated: { type: Date, default: () => new Date() },
  dismissedHints: {
    editingIntro: Boolean,
    learningFalseNegative: Boolean,
    learningFlag: Boolean,
  },
});

// prevent double compilation during development
if (!cached.init) {
  cached.init = true;
  cached.LearnItem = model<LearnItemType>('LearnItem', LearnItemSchema);
  cached.List = model<ListType & Document>('LearnList', ListSchema);
  cached.Settings = model<SettingsType & Document>('Settings', SettingsSchema);
}

const { Progress, LearnItem, List, Settings } = cached;

export { Progress, LearnItem, List, Settings };
