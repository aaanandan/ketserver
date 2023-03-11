import { MongoClient } from "mongodb";
const connectionString = process.env.MONGO_URI || "mongodb+srv://ketdbuser:FzWiMaHrbycV8qyq@ketdata.3o8vrig.mongodb.net/ket";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
let db = conn.db("ket");
export default db;