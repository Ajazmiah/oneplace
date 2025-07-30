// lib/mongodb.js
import mongoose from "mongoose";

// Store the connection state globally (helps in development with hot reloads)
const globalWithMongoose = global;

// Use existing connection if already connected
let isConnected = globalWithMongoose._mongooseConnection || false;

export const connectDb = async () => {
  if (isConnected) return;

  // Check if there's an existing connection from Mongoose
  if (mongoose.connections.length > 0) {
    const connection = mongoose.connections[0];

    // If connected, reuse it
    if (connection.readyState === 1) {
      isConnected = true;
      return;
    }

    // Disconnect stale connection
    await mongoose.disconnect();
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      // ✅ Use the new MongoDB connection string parser (more reliable)
      useNewUrlParser: true,

      // ✅ Use the new unified topology engine (handles connection pooling better)
      useUnifiedTopology: true,
    });

    // Mark as connected
    isConnected = true;
    globalWithMongoose._mongooseConnection = true;

    console.log("✅ MongoDB connected:", db.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit the app if unable to connect
  }
};
