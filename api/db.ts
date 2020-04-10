import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, DB_USER, DB_PASS } = process.env;

mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('connection error: ' + error);
});

db.once('open', (error) => {
  console.log(error || 'DB connection successful');
});

module.exports = db;
