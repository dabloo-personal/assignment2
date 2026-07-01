import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Session from '../models/Session';
import { AppError } from '../utils/AppError';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email) {
      throw new AppError(400, 'fullName and email are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(409, 'A user with this email already exists');
    }

    const user = await User.create({ fullName, email, phone });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new AppError(400, 'Invalid user id');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const [result] = await Session.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'teachers',
          localField: 'teacherId',
          foreignField: '_id',
          as: 'teacher',
        },
      },
      { $unwind: '$teacher' },
      {
        $project: {
          _id: 1,
          teacherId: 1,
          userId: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          completedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          teacher: {
            _id: '$teacher._id',
            fullName: '$teacher.fullName',
            specialization: '$teacher.specialization',
            experience: '$teacher.experience',
          },
        },
      },
      { $sort: { startTime: 1 } },
      {
        $facet: {
          upcomingSessions: [{ $match: { status: { $ne: 'COMPLETED' } } }],
          completedSessions: [{ $match: { status: 'COMPLETED' } }],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        upcomingSessions: result?.upcomingSessions || [],
        completedSessions: result?.completedSessions || [],
      },
    });
  } catch (error) {
    next(error);
  }
};
