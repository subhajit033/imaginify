import mongoose, { Mongoose } from 'mongoose';

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(process.env.MONGODB_URL!, { bufferCommands: false });

  try {
    cached.conn = await cached.promise;
    console.log('connected db..');
  } catch (err) {
    console.log(err);
  }
  return cached.conn;
};
