import type { Request, Response, NextFunction } from 'express';
import Teacher from '../models/Teacher';
import { AppError } from '../utils/AppError';

export const createTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, specialization, experience } = req.body;

    if (!fullName || !email || !specialization || experience === undefined) {
      throw new AppError(400, 'fullName, email, specialization, and experience are required');
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      throw new AppError(409, 'A teacher with this email already exists');
    }

    const teacher = await Teacher.create({ fullName, email, specialization, experience });
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};
