import { json as jsonParser } from 'body-parser';
import * as express from 'express';

import './db';
import { auth } from './auth';
import { corsMiddleware } from './cors';
import { catch404, handleError } from './errors';
import lists from './lists';

const app = express();
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`${Date()}\nListening on port ${PORT}.`));

app.use(corsMiddleware);
app.use(jsonParser());

app.get('/ping', async (req, res) => {
  res.sendStatus(200);
});

app.use('/', auth);

app.use('/lists', lists);

app.use(catch404);
app.use(handleError);
