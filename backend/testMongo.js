// testMongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("MONGO_URI from env:", uri);
async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ MongoDB connection FAILED");
    console.error(err.message);
  }
}

testConnection();
