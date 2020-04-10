import { Router } from 'express';
import slugify from 'slugify';
import { getProgressSummary, mapList } from './helpers';
import items from './items';
import { List } from './models';

const router = Router();

// find list -> req.list
router.param('listId', async (req, res, next) => {
  try {
    const list = await List.findById(req.params.listId).populate('items');

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
router.get('/', async ({ query: { slug } }, res, next) => {
  if (!slug) {
    return next();
  }

  try {
    const list = await List.findOne({ slug }).populate('items');
    if (!list) {
      return next({ status: 404 });
    }

    const progress = getProgressSummary(list.items);
    res.json({ ...mapList(list), progress });
  } catch (error) {
    next(error);
  }
});

// ===========================

// get all lists
router.get('/', async (req, res, next) => {
  try {
    const lists = await List.find();
    const listsSummary = lists.map((list) => mapList(list));
    res.json(listsSummary);
  } catch (error) {
    next(error);
  }
});

// get specific list
router.get('/:listId', ({ list }, res, next) => {
  try {
    const progress = getProgressSummary(list.items);
    res.json({ ...mapList(list), progress });
  } catch (error) {
    next(error);
  }
});

// dev: get specific list with all infos
router.get('/:listId/full', ({ list }, res, next) => {
  try {
    const progress = getProgressSummary(list.items);
    res.json({ ...mapList(list, true), progress });
  } catch (error) {
    next(error);
  }
});

// create list
router.post('/', async ({ body: { name } }, res, next) => {
  if (!name) {
    return next(new Error('Name must be provided.'));
  }

  const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
  const listsWithSlug = await List.find({ slug });

  if (listsWithSlug.length > 0) {
    return next({
      message: `Slug already exists: ${slug}`,
      status: 409,
    });
  }

  try {
    const list = await new List({ name, slug }).save();
    res.json(mapList(list));
  } catch (error) {
    next(error);
  }
});

// change list properties
router.put('/:listId', async ({ list, body: { name } }, res, next) => {
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
    await List.findByIdAndDelete(req.params.listId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.use('/:listId/items', items);

export default router;
