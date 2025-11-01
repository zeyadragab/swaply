import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import User, { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: User;
  userId?: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized, no token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401);
    }

    if (user.isBlocked) {
      throw new AppError('User account is blocked', 403);
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
