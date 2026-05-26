import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL is not set in .env');
  }
  if (/CLUSTER\.mongodb\.net|USER:PASSWORD@/i.test(uri)) {
    throw new Error(
      'DATABASE_URL still uses .env.example placeholders. In MongoDB Atlas → Connect → Drivers, copy the real connection string into Bakeoff2/.env'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log('[db] MongoDB connected');
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
