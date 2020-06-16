import * as dayjs from 'dayjs';
import { Router } from 'express';
import {
  getDue,
  mapItem,
  mapItems,
  recalcEasiness,
  recalcInterval,
} from './helpers';
import { LearnItem, List, Progress } from './models';

const router = Router();

// get all items
router.get('/', async ({ list: { items } }, res, next) => {
  try {
    res.json(mapItems(items));
  } catch (error) {
    next(error);
  }
});

// add items
router.post('/', async ({ list, body: { items } }, res, next) => {
  if (!items || !items.length) {
    return next(new Error('No items provided.'));
  }

  try {
    const addedItems = await LearnItem.insertMany(items as object[]);
    const addedItemsIds = addedItems.map(({ _id }) => _id);
    await List.findByIdAndUpdate(list._id, {
      $push: { items: { $each: addedItemsIds } },
      $currentDate: { updated: true },
    });
    res.json(mapItems(addedItems));
  } catch (error) {
    next(error);
  }
});

// change an item
router.put('/:itemId', async ({ list, params, body }, res, next) => {
  const { itemId } = params;
  const { prompt, solution } = body;

  if (!prompt || !solution) {
    return next(new Error('Prompt + solution must be provided.'));
  }

  try {
    const item = await LearnItem.findById(itemId);

    if (!item) {
      return res.sendStatus(404);
    }

    item.prompt = prompt;
    item.solution = solution;
    item.updated = new Date();
    const changedItem = await item.save();

    list.updated = new Date();
    await list.save();

    res.json(mapItem(changedItem));
  } catch (error) {
    next(error);
  }
});

// delete an item
router.delete('/:itemId', async ({ list, params: { itemId } }, res, next) => {
  try {
    const item = await LearnItem.findByIdAndDelete(itemId);

    if (!item) {
      return res.sendStatus(404);
    }

    await List.findByIdAndUpdate(list._id, {
      $pull: { items: itemId },
      $currentDate: { updated: true },
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// ============

// get items to learn
const DEFAULT_AMOUNT = 20;
router.get('/learn/:count?', async ({ list, params: { count } }, res, next) => {
  try {
    const itemsToLearn = list.items
      .filter(({ progress: { due } }) => dayjs(due).isBefore(dayjs()))
      .sort(
        ({ progress: { due: a } }, { progress: { due: b } }) =>
          a.getTime() - b.getTime(),
      );

    const amount = parseInt(count, 10) > 0 ? parseInt(count) : DEFAULT_AMOUNT;

    res.json(mapItems(itemsToLearn.slice(0, amount)));
  } catch (error) {
    next(error);
  }
});

// report item progress when learned (correct/wrong)
router.put('/:itemId/progress', async ({ params, body }, res, next) => {
  const { answerQuality } = body;
  if (
    typeof answerQuality !== 'number' ||
    answerQuality < 0 ||
    answerQuality > 5
  ) {
    return next(new Error('Answer quality from 0-5 must be provided.'));
  }

  try {
    const item = await LearnItem.findById(params.itemId);

    if (!item) {
      return res.sendStatus(404);
    }

    const {
      easiness,
      interval,
      stage,
      timesCorrect,
      timesWrong,
    } = item.progress;

    const isCorrect = answerQuality >= 3;
    const newInterval = recalcInterval(interval, easiness, isCorrect);

    item.progress = new Progress({
      easiness: recalcEasiness(easiness, answerQuality),
      stage: isCorrect ? (stage >= 4 ? 4 : stage + 1) : 1,
      interval: newInterval,
      due: getDue(interval),
      timesCorrect: isCorrect ? timesCorrect + 1 : timesCorrect,
      timesWrong: isCorrect ? timesWrong : timesWrong + 1,
      updated: new Date(),
    });

    await item.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

export default router;
