import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://bramesh1011_db_user:LovelyRam1011@cluster0.op1xcuz.mongodb.net/?appName=Cluster0";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  clientPromise
    .then((data) => data.db())
    .then((db) => console.log("Connected to MongoDB:", db.databaseName));
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  throw error;
}

export default clientPromise;
