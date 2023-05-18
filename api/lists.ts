import { Router } from 'express';
import slugify from 'slugify';
import { getProgressSummary, getUserId, mapList } from './helpers';
import items from './items';
import { List, ListType } from './models';

const router = Router();

// find list -> req.list -- as JSON object
router.param('listIdLean', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const list = await List.findOne({ _id: req.params.listIdLean, userId }).lean();
    if (!list) {
      return next({ status: 404 });
    }

    req.listLean = list as ListType;
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
  if (!slug || typeof slug !== 'string') {
    return next();
  }

  try {
    const userId = getUserId({ user });
    const list: ListType = await List.findOne({ slug, userId }).lean();
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
    const lists: ListType[] = await List.find({ userId: getUserId(req) }).lean();
    const listsSummary = lists.map((list) => mapList(list, { lastLearnt: true }));
    res.json(listsSummary);
  } catch (error) {
    next(error);
  }
});

// get specific list   -- unused
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
router.patch('/:listId', async ({ list, body: { name, amount } }, res, next) => {
  if (!name && typeof amount !== 'number' && amount !== 'auto') {
    return next(new Error('Name or amount must be provided.'));
  }

  try {
    if (name) list.name = name;
    if (amount === 'auto') list.learnCount = null;
    if (typeof amount === 'number') list.learnCount = amount;
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
    await List.findByIdAndDelete(req.params.listId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// safe (if trying to edit list by other user, param handler would already have 404'd)
router.use('/:listIdLean/items', items);

export default router;
