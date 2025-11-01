import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import User, { AuthProvider } from '../models/User';
import { body, validationResult } from 'express-validator';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
];

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    authProvider: AuthProvider.EMAIL,
  });

  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    status: 'success',
    data: {
      user: user.toJSON(),
      token,
      refreshToken,
    },
  });
});

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  if (user.isBlocked) {
    throw new AppError('Your account has been blocked', 403);
  }

  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    status: 'success',
    data: {
      user: user.toJSON(),
      token,
      refreshToken,
    },
  });
});

export const refreshTokenHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      status: 'success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});
