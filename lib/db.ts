import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalThis.mongooseCache = cached;

export function hasMongo() {
  return Boolean(MONGODB_URI);
}

export async function connectDB() {
  if (!MONGODB_URI) {
    return null;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
      .then((m) => m)
      .catch((err) => {
        console.warn("MongoDB connection failed — using local catalog store:", err?.message || err);
        cached.promise = null;
        return null;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
