import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const url = "mongodb+srv://sandeepkumarrai217_db_user:Sandy123@cluster0.palos8z.mongodb.net/?appName=Cluster0";
const dbName = "node-project";
export const collectionName = "todo";
if (!url) {
  console.error("❌ MONGODB_URI is not set in environment variables");
}
const client = new MongoClient(url, {
  serverSelectionTimeoutMS: 10000,  // fail fast with clear error
});

export const connection = async () => {
  try {
    const connect = await client.connect();
    return connect.db(dbName);
  } catch (err) {
    console.error("❌ Mongo connection error in dbConfig.js:", err);
    throw err;
  }
};
