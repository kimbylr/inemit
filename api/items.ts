import * as dayjs from 'dayjs';
import { Router } from 'express';
import { Progress } from './models';

const router = Router();

// get all items
router.get('/', async ({ list: { items } }, res, next) => {
  try {
    res.json(items);
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
    const oldItemsIds = list.items.map(({ _id }) => _id);
    list.items = [...list.items, ...items];
    list.updated = new Date();
    const savedList = await list.save();
    const addedItems = savedList.items.filter(
      ({ _id }) => !oldItemsIds.includes(_id),
    );
    res.json(addedItems);
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
    list.items = list.items.map(item => {
      if (item._id == itemId) {
        item.prompt = prompt;
        item.solution = solution;
        item.updated = new Date();
      }

      return item;
    });
    list.updated = new Date();
    const changedList = await list.save();
    res.json(changedList.items.filter(({ _id }) => _id == itemId));
  } catch (error) {
    next(error);
  }
});

// delete an item
router.delete('/:itemId', async ({ list, params: { itemId } }, res, next) => {
  try {
    list.items = list.items.filter(({ _id }) => _id != itemId);
    list.updated = new Date();
    await list.save();
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
      )
      .map(({ _id, prompt, solution }) => ({ _id, prompt, solution }));

    const amount = parseInt(count, 10) > 0 ? parseInt(count) : DEFAULT_AMOUNT;

    res.json(itemsToLearn.slice(0, amount));
  } catch (error) {
    next(error);
  }
});

// report item progress when learned (correct/wrong)
router.put('/:itemId/progress', async ({ list, params, body }, res, next) => {
  const { answerQuality } = body;
  if (
    typeof answerQuality !== 'number' ||
    answerQuality < 0 ||
    answerQuality > 5
  ) {
    return next(new Error('Answer quality from 0-5 must be provided.'));
  }

  try {
    let found = false;
    list.items = list.items.map(item => {
      if (item._id == params.itemId) {
        found = true;
        const {
          easiness,
          interval,
          due,
          stage,
          timesCorrect,
          timesWrong,
        } = item.progress;
        const isCorrect = answerQuality >= 3;
        const newInterval = recalcInterval(interval, easiness, isCorrect);
        const newDue = isCorrect
          ? dayjs(due).add(newInterval, 'day')
          : dayjs().add(1, 'day');

        item.progress = new Progress({
          easiness: recalcEasiness(easiness, answerQuality),
          stage: isCorrect ? (stage >= 4 ? 4 : stage + 1) : 1,
          interval: newInterval,
          due: newDue.toDate(),
          timesCorrect: isCorrect ? timesCorrect + 1 : timesCorrect,
          timesWrong: isCorrect ? timesWrong : timesWrong + 1,
          updated: new Date(),
        });
      }

      return item;
    });

    if (!found) {
      return res.sendStatus(404);
    }

    await list.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// "SuperMemo 2.0" algorithm: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
const recalcEasiness = (easiness: number, answerQuality: number) => {
  const newEasiness =
    easiness +
    (0.1 - (5 - answerQuality) * (0.08 + (5 - answerQuality) * 0.02));

  if (newEasiness < 1.3) {
    return 1.3;
  }

  if (newEasiness > 2.5) {
    return 2.5;
  }

  return newEasiness;
};

const recalcInterval = (interval: number, easiness: number, correct: boolean) =>
  correct ? (interval === 1 ? 6 : interval * easiness) : 1;

export default router;
