import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: "../../.env" });

const uri = process.env.MONGO_URI;

async function testDB() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    console.log("✅ Native MongoDB Connected");

    await client.close();
  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

testDB();