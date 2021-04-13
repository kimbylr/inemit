import { Router } from 'express';
import {
  getDue,
  getInitialProgress,
  mapItem,
  mapItems,
  recalcEasiness,
  recalcInterval,
} from './helpers';
import { LearnItem, Progress } from './models';

const router = Router();

router.param('itemId', async (req, res, next) => {
  const { list, params } = req;
  try {
    const itemIndex = list.items.findIndex(({ _id }) => String(_id) === params.itemId);

    if (itemIndex === -1) {
      return next({ status: 404 });
    }

    req.itemIndex = itemIndex;
    next();
  } catch (error) {
    next(error);
  }
});

// add items
router.post('/', async ({ list, body: { items, stage } }, res, next) => {
  if (!items || !Array.isArray(items) || !items.length) {
    return next(new Error('No items provided.'));
  }

  const newItemsWithProgress = items.map(
    (item) => new LearnItem({ ...item, progress: getInitialProgress(stage) }),
  );

  try {
    list.items = [...list.items, ...newItemsWithProgress];
    list.updated = new Date();
    await list.save();
    res.json(mapItems(newItemsWithProgress));
  } catch (error) {
    next(error);
  }
});

// change an item
router.put('/:itemId', async ({ body, list, itemIndex }, res, next) => {
  const { prompt, solution, flagged, image } = body;
  const setFlagged = typeof flagged === 'boolean';
  const setImage = typeof image === 'object'; // null is also 'object'

  if (!prompt && !solution && !setFlagged && !setImage) {
    return next(new Error('Could not find a changeable property in body'));
  }

  try {
    const item = list.items[itemIndex];
    item.prompt = prompt || item.prompt;
    item.solution = solution || item.solution;
    item.flagged = setFlagged ? flagged : item.flagged;
    item.image = setImage ? image : item.image;
    item.updated = new Date();

    list.updated = new Date();
    await list.save();
    res.json(mapItem(item));
  } catch (error) {
    next(error);
  }
});

// delete an item
router.delete('/:itemId', async ({ list, itemIndex }, res, next) => {
  try {
    list.items.splice(itemIndex, 1);
    await list.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// ============

// report item progress when learned (correct/wrong)
router.put('/:itemId/progress', async ({ body, list, itemIndex }, res, next) => {
  const { answerQuality } = body;
  if (typeof answerQuality !== 'number' || answerQuality < 0 || answerQuality > 5) {
    return next(new Error('Answer quality from 0-5 must be provided.'));
  }

  console.time(); // TODO: remove

  try {
    const progress = list.items[itemIndex].progress;
    const { easiness, interval, stage, timesCorrect, timesWrong } = progress;

    console.timeLog(); // TODO: remove

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
    console.timeLog(); // TODO: remove

    list.items[itemIndex].progress = newProgress;
    await list.save();
    console.timeEnd(); // TODO: remove
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

export default router;
