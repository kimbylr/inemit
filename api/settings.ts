import { Router } from 'express';
import { getUserId } from './helpers';

import { Settings, SettingsType, HINTS } from './models';

const router = Router();

// get settings
router.get('/', async (req, res, next) => {
  try {
    const settings: Omit<SettingsType, 'userId' | 'updated'> = (await Settings.findOne({
      userId: getUserId(req),
    }).lean()) || { dismissedHints: HINTS };
    res.json({ dismissedHints: settings.dismissedHints });
  } catch (error) {
    next(error);
  }
});

// dismiss hint
router.patch('/hint', async (req, res, next) => {
  const { hint } = req.body;
  if (!Object.keys(HINTS).includes(hint)) {
    return next(new Error('Not a legit hint'));
  }

  try {
    const userId = getUserId(req);
    const settings =
      (await Settings.findOne({ userId })) ||
      new Settings({ dismissedHints: HINTS, userId });
    settings.dismissedHints[hint] = true;
    settings.updated = new Date();
    const changedSettings = await settings.save();
    res.json(changedSettings.dismissedHints);
  } catch (error) {
    next(error);
  }
});

export default router;
