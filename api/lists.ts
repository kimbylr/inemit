import { Router } from 'express';
import { List } from './models';
import items from './items';

const router = Router();

// find list -> req.list
router.param('listId', async (req, res, next) => {
  try {
    const list = await List.findById(req.params.listId);

    if (!list) {
      return next({ status: 404 });
    }

    req.list = list;
    next();
  } catch (error) {
    next(error);
  }
});

// ===========================

// get all lists
router.get('/', async (req, res, next) => {
  try {
    const lists = await List.find();
    const listsWithoutItems = lists.map(
      ({ _id, name, created, updated, items }) => ({
        _id,
        name,
        created,
        updated,
        itemsCount: items.length,
      }),
    );
    res.json(listsWithoutItems);
  } catch (error) {
    next(error);
  }
});

// get specific list
router.get('/:listId', ({ list }, res, next) => {
  try {
    res.json(list);
  } catch (error) {
    next(error);
  }
});

// create list
router.post('/', async ({ body: { name } }, res, next) => {
  if (!name) {
    return next(new Error('Name must be provided.'));
  }

  try {
    const list = await new List({ name }).save();
    res.json(list);
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
    res.json(changedList);
  } catch (error) {
    next(error);
  }
});

// delete list
router.delete('/:listId', async (req, res, next) => {
  try {
    await List.deleteOne({ _id: req.params.listId });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.use('/:listId/items', items);

export default router;
