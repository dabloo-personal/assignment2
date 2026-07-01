import express from 'express';
import userRoutes from './routes/userRoutes';
import teacherRoutes from './routes/teacherRoutes';
import sessionRoutes from './routes/sessionRoutes';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Teacher Session Booking API is running',
  });
});

app.use('/users', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/sessions', sessionRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, 'Route not found'));
});

app.use(errorHandler);

export default app;
