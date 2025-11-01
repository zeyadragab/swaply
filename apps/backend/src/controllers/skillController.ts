import { Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import Skill, { SkillCategory } from '../models/Skill';
import UserSkill, { SkillType } from '../models/UserSkill';
import User from '../models/User';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const getAllSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { category, search } = req.query;

  const whereClause: any = { isActive: true };

  if (category) {
    whereClause.category = category;
  }

  if (search) {
    whereClause.name = { [Op.iLike]: `%${search}%` };
  }

  const skills = await Skill.findAll({
    where: whereClause,
    order: [['name', 'ASC']],
  });

  res.json({
    status: 'success',
    data: { skills },
  });
});

export const addUserSkillValidation = [
  body('skillId').isUUID().withMessage('Valid skill ID required'),
  body('skillType').isIn(Object.values(SkillType)).withMessage('Valid skill type required'),
  body('level').notEmpty().withMessage('Skill level required'),
];

export const addUserSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { skillId, skillType, level, yearsOfExperience, description } = req.body;

  const skill = await Skill.findByPk(skillId);
  if (!skill) {
    throw new AppError('Skill not found', 404);
  }

  const existing = await UserSkill.findOne({
    where: {
      userId: req.userId!,
      skillId,
      skillType,
    },
  });

  if (existing) {
    throw new AppError('You already have this skill in your profile', 400);
  }

  const userSkill = await UserSkill.create({
    userId: req.userId!,
    skillId,
    skillType,
    level,
    yearsOfExperience,
    description,
  });

  // Update skill total users count
  await skill.increment('totalUsers');

  const result = await UserSkill.findByPk(userSkill.id, {
    include: [{ model: Skill, as: 'skill' }],
  });

  res.status(201).json({
    status: 'success',
    data: { userSkill: result },
  });
});

export const removeUserSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const userSkill = await UserSkill.findOne({
    where: {
      id,
      userId: req.userId!,
    },
  });

  if (!userSkill) {
    throw new AppError('User skill not found', 404);
  }

  await userSkill.destroy();

  // Update skill total users count
  await Skill.decrement('totalUsers', { where: { id: userSkill.skillId } });

  res.json({
    status: 'success',
    message: 'Skill removed from profile',
  });
});

export const getMySkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userSkills = await UserSkill.findAll({
    where: { userId: req.userId! },
    include: [{ model: Skill, as: 'skill' }],
  });

  const canTeach = userSkills.filter(s => s.skillType === SkillType.CAN_TEACH);
  const wantToLearn = userSkills.filter(s => s.skillType === SkillType.WANT_TO_LEARN);

  res.json({
    status: 'success',
    data: {
      canTeach,
      wantToLearn,
    },
  });
});

export const findMatches = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 20 } = req.query;

  // Get skills I can teach
  const myTeachingSkills = await UserSkill.findAll({
    where: {
      userId: req.userId!,
      skillType: SkillType.CAN_TEACH,
    },
    attributes: ['skillId'],
  });

  // Get skills I want to learn
  const myLearningSkills = await UserSkill.findAll({
    where: {
      userId: req.userId!,
      skillType: SkillType.WANT_TO_LEARN,
    },
    attributes: ['skillId'],
  });

  const myTeachingSkillIds = myTeachingSkills.map(s => s.skillId);
  const myLearningSkillIds = myLearningSkills.map(s => s.skillId);

  // Find users who want to learn what I teach and teach what I want to learn
  const matches = await User.findAll({
    where: {
      id: { [Op.ne]: req.userId! },
      isActive: true,
      isBlocked: false,
    },
    include: [
      {
        model: UserSkill,
        as: 'userSkills',
        include: [{ model: Skill, as: 'skill' }],
        where: {
          [Op.or]: [
            {
              skillType: SkillType.WANT_TO_LEARN,
              skillId: { [Op.in]: myTeachingSkillIds },
            },
            {
              skillType: SkillType.CAN_TEACH,
              skillId: { [Op.in]: myLearningSkillIds },
            },
          ],
        },
      },
    ],
    limit: Number(limit),
    attributes: { exclude: ['password'] },
  });

  res.json({
    status: 'success',
    data: { matches },
  });
});
