import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectToDatabase = async (): Promise<void> => {
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }

  await mongoose.connect(env.MONGO_URI);
};
