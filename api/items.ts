import * as dayjs from 'dayjs';
import { Router } from 'express';
import {
  getDue,
  getInitialProgress,
  mapItem,
  mapItems,
  recalcEasiness,
  recalcInterval,
} from './helpers';
import { LearnItem, List, Progress } from './models';

const router = Router();

router.param('itemId', async (req, res, next) => {
  const { listLean: list, params } = req;
  try {
    const item = list.items.find(({ _id }) => String(_id) === params.itemId);
    if (!item) {
      return next({ status: 404 });
    }

    req.item = item;
    next();
  } catch (error) {
    next(error);
  }
});

// get all items
router.get('/', async ({ listLean: list }, res, next) => {
  try {
    res.json(mapItems(list.items));
  } catch (error) {
    next(error);
  }
});

// get items to learn
const DEFAULT_AMOUNT = 20;
router.get('/learn/:count?', async ({ listLean: list, params: { count } }, res, next) => {
  try {
    const itemsToLearn = list.items
      .filter(({ progress: { due } }) => dayjs(due).isBefore(dayjs()))
      .sort(
        ({ progress: { due: a } }, { progress: { due: b } }) => a.getTime() - b.getTime(),
      );

    const amount = parseInt(count, 10) > 0 ? parseInt(count) : DEFAULT_AMOUNT;
    res.json(mapItems(itemsToLearn.slice(0, amount)));
  } catch (error) {
    next(error);
  }
});

// add items
router.post('/', async ({ listLean: list, body: { items, stage } }, res, next) => {
  if (!items || !Array.isArray(items) || !items.length) {
    return next(new Error('No items provided.'));
  }

  const newItemsWithProgress = items.map(
    (item) => new LearnItem({ ...item, progress: getInitialProgress(stage) }),
  );

  try {
    await List.updateOne(
      { _id: list._id },
      { $push: { items: { $each: newItemsWithProgress } } },
      { $set: { updated: new Date() } },
    );
    res.json(mapItems(newItemsWithProgress));
  } catch (error) {
    next(error);
  }
});

// change an item
router.patch('/:itemId', async ({ body, listLean: list, item }, res, next) => {
  const { prompt, solution, flagged, image } = body;
  const setFlagged = typeof flagged === 'boolean';
  const setImage = typeof image === 'object'; // null is also 'object'

  if (!prompt && !solution && !setFlagged && !setImage) {
    return next(new Error('Could not find a changeable property in body'));
  }

  try {
    item.prompt = prompt || item.prompt;
    item.solution = solution || item.solution;
    item.flagged = setFlagged ? flagged : item.flagged;
    item.image = setImage ? image : item.image;
    item.updated = new Date();

    await List.updateOne(
      { _id: list._id, 'items._id': item._id },
      { $set: { 'items.$': item, updated: new Date() } },
    );
    res.json(mapItem(item));
  } catch (error) {
    next(error);
  }
});

// delete an item
router.delete('/:itemId', async ({ listLean: list, item }, res, next) => {
  try {
    await List.updateOne(
      { _id: list._id },
      {
        $pull: { items: { _id: item._id } },
        $set: { updated: new Date() },
      },
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// report item progress when learned (correct/wrong)
router.patch('/:itemId/progress', async ({ body, listLean: list, item }, res, next) => {
  const { answerQuality } = body;
  if (typeof answerQuality !== 'number' || answerQuality < 0 || answerQuality > 5) {
    return next(new Error('Answer quality from 0-5 must be provided.'));
  }

  try {
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
      { _id: list._id, 'items._id': item._id },
      { $set: { 'items.$.progress': newProgress } },
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

export default router;
