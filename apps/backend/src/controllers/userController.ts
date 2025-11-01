import { Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import UserSkill from '../models/UserSkill';
import Skill from '../models/Skill';
import { body, validationResult } from 'express-validator';

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.userId, {
    include: [
      {
        model: UserSkill,
        as: 'userSkills',
        include: [{ model: Skill, as: 'skill' }],
      },
    ],
  });

  res.json({
    status: 'success',
    data: { user },
  });
});

export const updateMeValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('bio').optional().trim(),
  body('country').optional().trim(),
  body('timeZone').optional().trim(),
  body('language').optional().trim(),
];

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    bio,
    country,
    timeZone,
    language,
    phoneNumber,
  } = req.body;

  const user = await User.findByPk(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (bio !== undefined) user.bio = bio;
  if (country) user.country = country;
  if (timeZone) user.timeZone = timeZone;
  if (language) user.language = language;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();

  res.json({
    status: 'success',
    data: { user },
  });
});

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: UserSkill,
        as: 'userSkills',
        include: [{ model: Skill, as: 'skill' }],
      },
    ],
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: { user },
  });
});

export const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { query, skillId, country, page = 1, limit = 20 } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  const whereClause: any = {
    isActive: true,
    isBlocked: false,
  };

  if (query) {
    whereClause[Op.or] = [
      { firstName: { [Op.iLike]: `%${query}%` } },
      { lastName: { [Op.iLike]: `%${query}%` } },
      { displayName: { [Op.iLike]: `%${query}%` } },
    ];
  }

  if (country) {
    whereClause.country = country;
  }

  const include: any[] = [
    {
      model: UserSkill,
      as: 'userSkills',
      include: [{ model: Skill, as: 'skill' }],
    },
  ];

  if (skillId) {
    include[0].where = { skillId };
  }

  const { rows: users, count } = await User.findAndCountAll({
    where: whereClause,
    include,
    limit: Number(limit),
    offset,
    attributes: { exclude: ['password'] },
  });

  res.json({
    status: 'success',
    data: {
      users,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    },
  });
});

// Import Op at the top
import { Op } from 'sequelize';
