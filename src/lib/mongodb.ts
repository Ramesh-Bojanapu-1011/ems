import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://bramesh1011_db_user:TnDJ6ojpLBD1yM10@cluster0.op1xcuz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let client;
let clientPromise: Promise<MongoClient>;

declare global {
   
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
