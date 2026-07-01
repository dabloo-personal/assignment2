import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Session from '../models/Session';
import Teacher from '../models/Teacher';
import User from '../models/User';
import { AppError } from '../utils/AppError';

export const createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { teacherId, startTime, endTime } = req.body;

    if (!teacherId || !startTime || !endTime) {
      throw new AppError(400, 'teacherId, startTime, and endTime are required');
    }

    if (!Types.ObjectId.isValid(teacherId)) {
      throw new AppError(400, 'Invalid teacher id');
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new AppError(404, 'Teacher not found');
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (Number.isNaN(parsedStartTime.getTime()) || Number.isNaN(parsedEndTime.getTime())) {
      throw new AppError(400, 'startTime and endTime must be valid dates');
    }

    if (parsedEndTime <= parsedStartTime) {
      throw new AppError(400, 'endTime must be greater than startTime');
    }

    const session = await Session.create({
      teacherId,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      status: 'AVAILABLE',
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dateTimestamp } = req.query;

    if (!dateTimestamp) {
      throw new AppError(400, 'dateTimestamp query parameter is required');
    }

    const dateValue = Number(dateTimestamp);
    const requestedDate = new Date(dateValue);

    if (Number.isNaN(requestedDate.getTime())) {
      throw new AppError(400, 'dateTimestamp must be a valid timestamp');
    }

    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await Session.aggregate([
      {
        $match: {
          status: 'AVAILABLE',
          startTime: { $gte: startOfDay, $lte: endOfDay },
        },
      },
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
    ]);

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};

export const bookSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const sessionId = Array.isArray(id) ? id[0] : id;
    const { userId } = req.body;

    if (!userId) {
      throw new AppError(400, 'userId is required');
    }

    if (!sessionId || !Types.ObjectId.isValid(sessionId) || !Types.ObjectId.isValid(userId)) {
      throw new AppError(400, 'Invalid session or user id');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      throw new AppError(404, 'Session not found');
    }

    if (session.status !== 'AVAILABLE') {
      throw new AppError(409, 'Only available sessions can be booked');
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { status: 'BOOKED', userId },
      { new: true },
    );

    res.status(200).json({ success: true, data: updatedSession });
  } catch (error) {
    next(error);
  }
};

export const completeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const sessionId = Array.isArray(id) ? id[0] : id;

    if (!sessionId || !Types.ObjectId.isValid(sessionId)) {
      throw new AppError(400, 'Invalid session id');
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      throw new AppError(404, 'Session not found');
    }

    if (session.status !== 'BOOKED') {
      throw new AppError(409, 'Only booked sessions can be marked as completed');
    }

    const completedSession = await Session.findByIdAndUpdate(
      sessionId,
      { status: 'COMPLETED', completedAt: new Date() },
      { new: true },
    );

    res.status(200).json({ success: true, data: completedSession });
  } catch (error) {
    next(error);
  }
};
