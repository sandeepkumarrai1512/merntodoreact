import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = "mongodb+srv://sandeepkumarrai217_db_user:Sandy123@cluster0.palos8z.mongodb.net/?appName=Cluster0";
const dbName = "node-project";

export const collectionName = "todo";

const client = new MongoClient(url);

export const connection = async () => {
  const connect = await client.connect();
  return connect.db(dbName);
};
