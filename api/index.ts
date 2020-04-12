import { json as jsonParser } from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';

import './db';
import { catch404, handleError } from './errors';
import { auth } from './auth';
import lists from './lists';

const app = express();
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`${Date()}\nListening on port ${PORT}.`));

app.use(cors()); // TODO: configure
app.use(jsonParser());

app.use('/', auth);

app.use('/lists', lists);

app.use(catch404);
app.use(handleError);
