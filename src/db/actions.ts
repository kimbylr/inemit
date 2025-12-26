'use server';

import { LearnItemEditFields } from '@/types/types';
import dayjs from 'dayjs';
import slugify from 'slugify';
import { createList, deleteList, getItem, getListById, getListBySlug } from '.';
import {
  getDue,
  getInitialProgress,
  getLearnCount,
  getStatistics,
  mapItem,
  mapItems,
  mapList,
  recalcEasiness,
  recalcInterval,
} from './helpers';
import { LearnItem, List, Progress } from './models';

export const addList = async (name: string) => {
  if (!name) return;

  const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
  if (await getListBySlug(slug)) {
    console.error(`addList: Slug already exists for this user: ${slug}`);
    return;
  }

  try {
    return (await createList(name, slug)).slug;
  } catch (error) {
    console.error('Error in addList:', error);
  }
};

export const getList = async (slug: string) => {
  if (!slug) return;

  const list = await getListBySlug(slug, true);
  if (!list) return;

  return mapList(list, { flaggedItems: true, lastLearnt: true, progress: true });
};

export const getListToEdit = async (slug: string) => {
  if (!slug) return;

  const list = await getListBySlug(slug, true);
  if (!list) return;

  return mapList(list, { flaggedItems: true, lastLearnt: true, items: true });
};

export const getListToLearn = async (slug: string) => {
  if (!slug) return;

  const list = await getListBySlug(slug, true);
  if (!list) return;

  const itemsToLearn = list.items
    .filter(({ progress: { due } }) => dayjs(due).isBefore(dayjs()))
    .sort(({ progress: { due: a } }, { progress: { due: b } }) => a.getTime() - b.getTime());
  const amount = list.learnCount || getLearnCount(itemsToLearn.length);
  list.items = itemsToLearn.slice(0, amount);

  return mapList(list, { items: true });
};

export const renameList = async (id: string, name: string) => {
  if (!name || !id) return;

  const list = await getListById(id);
  if (!list) {
    console.error('renameList: List not found');
    return;
  }

  try {
    list.name = name;
    list.updated = new Date();
    const changedList = await list.save();
    return mapList(changedList);
  } catch (error) {
    console.error('Error in renameList:', error);
  }
};

export const setListSettings = async ({
  id,
  amount,
  repeat,
}: {
  id: string;
  amount?: 'auto' | number;
  repeat?: boolean;
}) => {
  if (!id) return;
  if (typeof amount !== 'number' && amount !== 'auto' && typeof repeat !== 'boolean') return;

  const list = await getListById(id);
  if (!list) {
    console.error('setListSettings: List not found');
    return;
  }

  try {
    if (amount === 'auto') list.learnCount = undefined;
    if (typeof amount === 'number') list.learnCount = amount;
    if (typeof repeat === 'boolean') list.repeat = repeat;
    list.updated = new Date();
    const changedList = await list.save();
    return mapList(changedList);
  } catch (error) {
    console.error('Error in setListSettings:', error);
  }
};

export const removeList = async (id: string) => {
  if (!id) return;

  const list = await getListById(id);
  if (!list) {
    console.error('removeList: List not found');
    return;
  }

  try {
    deleteList(id);
  } catch (error) {
    console.error('Error in removeList:', error);
  }
};

export const addItem = async ({
  listId,
  item: { prompt, solution } = {} as any,
}: {
  listId: string;
  item: LearnItemEditFields;
}) => {
  if (!listId || !prompt || !solution) return;

  const list = await getListById(listId);
  if (!list) {
    console.error('addItem: List not found');
    return;
  }

  try {
    const item = new LearnItem({ prompt, solution, progress: getInitialProgress() });
    await List.updateOne(
      { _id: listId },
      {
        $push: { items: item },
        $set: { updated: new Date() },
      },
    );
    return mapItem(item);
  } catch (error) {
    console.error('Error in addItem:', error);
  }
};

export const addItems = async ({
  listId,
  items,
  stage,
}: {
  listId: string;
  items: LearnItemEditFields[];
  stage: 1 | 3;
}) => {
  if (!listId || !items) return;

  const list = await getListById(listId);
  if (!list) {
    console.error('addItems: List not found');
    return;
  }

  try {
    const progress = getInitialProgress(stage || 1);
    const docs = items
      .filter((item) => item.prompt && item.solution)
      .map(({ prompt, solution }) => new LearnItem({ prompt, solution, progress }));
    if (docs.length === 0) return;

    await List.updateOne(
      { _id: listId },
      {
        $push: { items: { $each: docs } },
        $set: { updated: new Date() },
      },
    );
    return mapItems(docs);
  } catch (error) {
    console.error('Error in addItems:', error);
  }
};

export const editItem = async ({
  listId,
  itemId,
  item: { prompt, promptAddition, solution, flagged, image } = {} as any,
}: {
  listId: string;
  itemId: string;
  item: Partial<LearnItemEditFields>;
}) => {
  if (!listId || !itemId) return;

  const setFlagged = typeof flagged === 'boolean';
  const setImage = typeof image === 'object'; // null is also 'object'
  const setPromptAddition = typeof promptAddition === 'string';
  if (!prompt && !promptAddition && !solution && !setFlagged && !setImage) {
    console.error('editItem: Could not find a changeable property');
    return;
  }

  try {
    const item = await getItem(listId, itemId);
    if (!item) {
      console.error('editItem: Could not find item');
      return;
    }

    if (image) delete image.onChooseImgUrl;

    item.prompt = prompt || item.prompt;
    item.promptAddition = setPromptAddition ? promptAddition : item.promptAddition;
    item.solution = solution || item.solution;
    item.flagged = setFlagged ? flagged : item.flagged;
    item.image = setImage ? image : item.image;
    item.updated = new Date();

    await List.updateOne(
      { _id: listId, 'items._id': item._id },
      { $set: { 'items.$': item, updated: new Date() } },
    );
    return mapItem(item);
  } catch (error) {
    console.error('Error in editItem:', error);
  }
};

export const deleteItem = async ({ listId, itemId }: { listId: string; itemId: string }) => {
  if (!listId || !itemId) return;

  const list = await getItem(listId, itemId);
  if (!list) {
    console.error('deleteItem: Item not found');
    return;
  }

  try {
    await List.updateOne(
      { _id: listId },
      {
        $pull: { items: { _id: itemId } },
        $set: { updated: new Date() },
      },
    );
  } catch (error) {
    console.error('Error in deleteItem:', error);
  }
};

export const updateItemProgress = async ({
  listId,
  itemId,
  answerQuality,
}: {
  listId: string;
  itemId: string;
  answerQuality: 0 | 1 | 2 | 3 | 4 | 5;
}) => {
  if (!listId || !itemId) return;
  if (typeof answerQuality !== 'number' || answerQuality < 0 || answerQuality > 5) return;

  try {
    const item = await getItem(listId, itemId);
    if (!item) return;

    const { easiness, interval, stage, timesCorrect, timesWrong } = item.progress;
    const isCorrect = answerQuality >= 3;
    const newInterval = recalcInterval(interval, easiness, isCorrect);
    const newProgress = new Progress({
      easiness: recalcEasiness(easiness, answerQuality),
      stage: isCorrect ? (stage >= 4 ? 4 : stage + 1) : 1,
      interval: newInterval,
      due: getDue(newInterval),
      timesCorrect: isCorrect ? timesCorrect + 1 : timesCorrect,
      timesWrong: isCorrect ? timesWrong : timesWrong + 1,
      updated: new Date(),
    });

    await List.updateOne(
      { _id: listId, 'items._id': itemId },
      { $set: { 'items.$.progress': newProgress } },
    );
  } catch (error) {
    console.error('Error in updateItemProgress:', error);
  }
};

export const getListStatistics = async (id: string) => {
  const list = await getListById(id, true);
  return list ? getStatistics(list?.items) : null;
};
