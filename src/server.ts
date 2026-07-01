import app from './app';
import { env } from './config/env';
import { connectToDatabase } from './db/connect';

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
