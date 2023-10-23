import 'server-only';

import { getSession } from '@auth0/nextjs-auth0';
import mongoose from 'mongoose';
import { mapList } from './helpers';
import { List } from './models';

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASS = process.env.DB_PASS;

let cached = (global as any).mongooseConnection;
const initDB = async () => {
  if (!cached) {
    cached = await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`);
  }
};

const getUserId = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error('not logged in');
  }
  return session?.user.sub;
};

export const createList = async (name: string, slug: string) => {
  await initDB();
  const list = await new List({ name, slug, userId: await getUserId() }).save();
  return mapList(list);
};

export const deleteList = async (id: string) => {
  await initDB();
  await List.findByIdAndDelete(id);
};

const getLists = async () => {
  await initDB();
  return List.find({ userId: await getUserId() }).lean();
};

export const getListById = async (id: string, readOnly?: boolean) => {
  await initDB();
  return List.findOne({ userId: await getUserId(), _id: id }, null, { lean: readOnly });
};

export const getListBySlug = async (slug: string, readOnly?: boolean) => {
  await initDB();
  return List.findOne({ userId: await getUserId(), slug }, null, { lean: readOnly });
};

export const getListsSummary = async () => {
  const lists = await getLists();
  return lists.map((list) => mapList(list, { lastLearnt: true, progress: true }));
};

export const getItem = async (listId: string, itemId: string) => {
  await initDB();
  const list = await getListById(listId, true);
  if (!list) throw new Error('list not found');
  return list.items.find(({ _id }) => itemId === _id.toString());
};
