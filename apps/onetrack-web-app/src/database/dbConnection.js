// lib/mongodb.js
import mongoose from "mongoose";

// Cache the connection promise globally (helps in development with hot reloads,
// and lets concurrent callers await the same in-flight connect instead of
// racing a disconnect/reconnect against each other)
const globalWithMongoose = global;
let cached = globalWithMongoose._mongoose;

if (!cached) {
  cached = globalWithMongoose._mongoose = { conn: null, promise: null };
}

export const connectDb = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((m) => {
        console.log("✅ MongoDB connected:", m.connection.host);
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("❌ MongoDB connection error:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
