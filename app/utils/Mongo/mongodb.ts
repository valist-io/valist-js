import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB, NODE_ENV } = process.env;
const options = {};
let uri = process.env.MONGODB_URI;
let client: MongoClient;
// eslint-disable-next-line import/no-mutable-exports
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI || !uri) {
  uri = '';
  throw new Error('Please add your Mongo URI to .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please add your Mongo DB to .env.local');
}

if (NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any).mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any).mongoClientPromise = client.connect();
  }
  clientPromise = (global as any).mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
