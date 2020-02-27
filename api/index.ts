import { json as jsonParser } from 'body-parser';
import * as express from 'express';

import './db';
import { catch404, handleError } from './errors';
import lists from './lists';

const app = express();
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`${Date()}\nListening on port ${PORT}.`));

app.use(jsonParser());

// app.use('/', secret);

app.use('/lists', lists);

app.use(catch404);
app.use(handleError);
