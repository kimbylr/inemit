import { Document, Schema, model } from 'mongoose';

export interface ProgressType extends Document {
  lastLearnt?: Date;
  due: Date;
  stage: number;
  interval: number;
  easiness: number;
  timesCorrect: number;
  timesWrong: number;
  updated: Date;
}

const ProgressSchema = new Schema<ProgressType>({
  lastLearnt: Date,
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

export interface LearnItemType extends Document {
  created: Date;
  updated: Date;
  prompt: string;
  solution: string;
  progress: ProgressType;
}

const LearnItemSchema = new Schema<LearnItemType>({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  prompt: { type: String, required: true },
  solution: { type: String, required: true },
  progress: { type: ProgressSchema, default: new Progress() },
});

export const LearnItem = model<LearnItemType>('LearnItem', LearnItemSchema);

// ================

export interface ListType extends Document {
  name: string;
  created: Date;
  updated: Date;
  items: LearnItemType[];
}

const ListSchema = new Schema<ListType>({
  name: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  items: [LearnItemSchema],
});

export const List = model<ListType>('List', ListSchema);
