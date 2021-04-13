import * as dayjs from 'dayjs';
import { Router } from 'express';
import slugify from 'slugify';
import { getProgressSummary, getUserId, mapItems, mapList } from './helpers';
import items from './items';
import { List } from './models';

const router = Router();

// find list -> req.list -- as JSON object
router.param('listIdLean', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const list = await List.findOne({ _id: req.params.listIdLean, userId }).lean();
    if (!list) {
      return next({ status: 404 });
    }

    req.listLean = list;
    next();
  } catch (error) {
    next(error);
  }
});

// find list -> req.list -- as Mongoose Document
router.param('listId', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const list = await List.findOne({ _id: req.params.listId, userId });
    if (!list) {
      return next({ status: 404 });
    }

    req.list = list;
    next();
  } catch (error) {
    next(error);
  }
});

// get list by slug
router.get('/', async ({ query: { slug }, user }, res, next) => {
  if (!slug) {
    return next();
  }

  try {
    const userId = getUserId({ user });
    const list = await List.findOne({ slug, userId }).lean();
    if (!list) {
      return next({ status: 404 });
    }

    const progress = getProgressSummary(list.items);
    res.json({ ...mapList(list, { flaggedItems: true }), progress });
  } catch (error) {
    next(error);
  }
});

// ===========================

// get all lists
router.get('/', async (req, res, next) => {
  try {
    const lists = await List.find({ userId: getUserId(req) }).lean();
    const listsSummary = lists.map((list) => mapList(list, { lastLearnt: true }));
    res.json(listsSummary);
  } catch (error) {
    next(error);
  }
});

// get specific list
router.get('/:listIdLean', ({ listLean: list }, res, next) => {
  try {
    const progress = getProgressSummary(list.items);
    res.json({ ...mapList(list), progress });
  } catch (error) {
    next(error);
  }
});

// dev: get specific list with all infos
router.get('/:listIdLean/full', ({ listLean: list }, res, next) => {
  try {
    const progress = getProgressSummary(list.items);
    res.json({ ...mapList(list, { items: true }), progress });
  } catch (error) {
    next(error);
  }
});

// create list
router.post('/', async ({ body: { name }, user }, res, next) => {
  if (!name) {
    return next(new Error('Name must be provided.'));
  }

  const userId = getUserId({ user });
  const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
  const listsWithSlug = await List.find({ slug, userId }).lean();

  if (listsWithSlug.length > 0) {
    return next({
      message: `Slug already exists for this user: ${slug}`,
      status: 409,
    });
  }

  try {
    const list = await new List({ name, slug, userId }).save();
    res.json(mapList(list));
  } catch (error) {
    next(error);
  }
});

// change list properties
router.patch('/:listId', async ({ list, body: { name } }, res, next) => {
  if (!name) {
    return next(new Error('Name must be provided.'));
  }

  try {
    list.name = name;
    list.updated = new Date();
    const changedList = await list.save();
    res.json(mapList(changedList));
  } catch (error) {
    next(error);
  }
});

// delete list
router.delete('/:listId', async (req, res, next) => {
  try {
    // TODO: delete items as well
    await List.findByIdAndDelete(req.params.listId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// ============ GET items

// get all items
router.get('/:listIdLean/items', async ({ listLean: list }, res, next) => {
  try {
    res.json(mapItems(list.items));
  } catch (error) {
    next(error);
  }
});

// get items to learn
const DEFAULT_AMOUNT = 20;
router.get(
  '/:listIdLean/items/learn/:count?',
  async ({ listLean: list, params: { count } }, res, next) => {
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
  },
);

// safe (if trying to edit list by other user, param handler would already have 404'd)
router.use('/:listId/items', items);

export default router;
