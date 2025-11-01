import { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import Session, { SessionType, SessionStatus } from '../models/Session';
import User from '../models/User';
import Skill from '../models/Skill';
import TokenTransaction, { TransactionType } from '../models/TokenTransaction';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { sequelize } from '../database/connection';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export const createSessionValidation = [
  body('teacherId').isUUID(),
  body('skillId').isUUID(),
  body('sessionType').isIn(Object.values(SessionType)),
  body('scheduledStartTime').isISO8601(),
  body('scheduledEndTime').isISO8601(),
  body('title').trim().notEmpty(),
];

export const createSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    teacherId,
    skillId,
    sessionType,
    scheduledStartTime,
    scheduledEndTime,
    title,
    description,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const teacher = await User.findByPk(teacherId);
    const learner = await User.findByPk(req.userId!);
    const skill = await Skill.findByPk(skillId);

    if (!teacher || !skill || !learner) {
      throw new AppError('Invalid teacher, learner, or skill', 400);
    }

    const startTime = new Date(scheduledStartTime);
    const endTime = new Date(scheduledEndTime);
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    let tokenCost = 0;
    if (sessionType === SessionType.PAID_LESSON) {
      tokenCost = parseInt(process.env.TOKENS_PER_LESSON || '20');

      if (learner.tokenBalance < tokenCost) {
        throw new AppError('Insufficient tokens', 400);
      }

      // Deduct tokens from learner
      await learner.update(
        {
          tokenBalance: learner.tokenBalance - tokenCost,
          totalTokensSpent: learner.totalTokensSpent + tokenCost,
        },
        { transaction }
      );

      // Record transaction
      await TokenTransaction.create(
        {
          userId: learner.id,
          amount: -tokenCost,
          type: TransactionType.SPENT_LEARNING,
          description: `Paid for lesson: ${title}`,
          balanceBefore: learner.tokenBalance,
          balanceAfter: learner.tokenBalance - tokenCost,
        },
        { transaction }
      );
    }

    const session = await Session.create(
      {
        teacherId,
        learnerId: req.userId!,
        skillId,
        sessionType,
        scheduledStartTime: startTime,
        scheduledEndTime: endTime,
        durationMinutes,
        tokenCost,
        title,
        description,
        roomId: `room_${Date.now()}`,
      },
      { transaction }
    );

    await transaction.commit();

    const result = await Session.findByPk(session.id, {
      include: [
        { model: User, as: 'teacher', attributes: { exclude: ['password'] } },
        { model: User, as: 'learner', attributes: { exclude: ['password'] } },
        { model: Skill, as: 'skill' },
      ],
    });

    res.status(201).json({
      status: 'success',
      data: { session: result },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

export const getMySessions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, type, upcoming } = req.query;

  const whereClause: any = {
    [Op.or]: [{ teacherId: req.userId! }, { learnerId: req.userId! }],
  };

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.sessionType = type;
  }

  if (upcoming === 'true') {
    whereClause.scheduledStartTime = { [Op.gte]: new Date() };
    whereClause.status = SessionStatus.SCHEDULED;
  }

  const sessions = await Session.findAll({
    where: whereClause,
    include: [
      { model: User, as: 'teacher', attributes: { exclude: ['password'] } },
      { model: User, as: 'learner', attributes: { exclude: ['password'] } },
      { model: Skill, as: 'skill' },
    ],
    order: [['scheduledStartTime', 'DESC']],
  });

  res.json({
    status: 'success',
    data: { sessions },
  });
});

export const getSessionById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const session = await Session.findOne({
    where: {
      id,
      [Op.or]: [{ teacherId: req.userId! }, { learnerId: req.userId! }],
    },
    include: [
      { model: User, as: 'teacher', attributes: { exclude: ['password'] } },
      { model: User, as: 'learner', attributes: { exclude: ['password'] } },
      { model: Skill, as: 'skill' },
    ],
  });

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  res.json({
    status: 'success',
    data: { session },
  });
});

export const startSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const session = await Session.findOne({
    where: {
      id,
      [Op.or]: [{ teacherId: req.userId! }, { learnerId: req.userId! }],
      status: SessionStatus.SCHEDULED,
    },
  });

  if (!session) {
    throw new AppError('Session not found or already started', 404);
  }

  // Generate Agora token
  let agoraToken = '';
  if (process.env.AGORA_APP_ID && process.env.AGORA_APP_CERTIFICATE) {
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const channelName = session.roomId!;
    const uid = 0;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    agoraToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
  }

  await session.update({
    status: SessionStatus.IN_PROGRESS,
    actualStartTime: new Date(),
    agoraToken,
  });

  res.json({
    status: 'success',
    data: {
      session,
      agoraToken,
      appId: process.env.AGORA_APP_ID,
    },
  });
});

export const endSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    const session = await Session.findOne({
      where: {
        id,
        teacherId: req.userId!,
        status: SessionStatus.IN_PROGRESS,
      },
    });

    if (!session) {
      throw new AppError('Session not found or not in progress', 404);
    }

    const actualEndTime = new Date();
    await session.update(
      {
        status: SessionStatus.COMPLETED,
        actualEndTime,
      },
      { transaction }
    );

    // Calculate actual duration
    const actualDuration =
      session.actualStartTime
        ? Math.round((actualEndTime.getTime() - session.actualStartTime.getTime()) / 60000)
        : session.durationMinutes;

    // Update teacher stats and award tokens
    const teacher = await User.findByPk(session.teacherId);
    if (teacher) {
      const tokensEarned = parseInt(process.env.TOKENS_PER_LESSON || '20');

      await teacher.update(
        {
          tokenBalance: teacher.tokenBalance + tokensEarned,
          totalTokensEarned: teacher.totalTokensEarned + tokensEarned,
          totalLessonsTaught: teacher.totalLessonsTaught + 1,
          totalTeachingHours: teacher.totalTeachingHours + actualDuration / 60,
        },
        { transaction }
      );

      await TokenTransaction.create(
        {
          userId: teacher.id,
          amount: tokensEarned,
          type: TransactionType.EARNED_TEACHING,
          description: `Earned from teaching: ${session.title}`,
          referenceId: session.id,
          referenceType: 'session',
          balanceBefore: teacher.tokenBalance,
          balanceAfter: teacher.tokenBalance + tokensEarned,
        },
        { transaction }
      );
    }

    // Update learner stats
    const learner = await User.findByPk(session.learnerId);
    if (learner) {
      await learner.update(
        {
          totalLessonsAttended: learner.totalLessonsAttended + 1,
          totalLearningHours: learner.totalLearningHours + actualDuration / 60,
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.json({
      status: 'success',
      data: { session },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

export const cancelSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const session = await Session.findOne({
      where: {
        id,
        [Op.or]: [{ teacherId: req.userId! }, { learnerId: req.userId! }],
        status: SessionStatus.SCHEDULED,
      },
    });

    if (!session) {
      throw new AppError('Session not found or cannot be cancelled', 404);
    }

    // Refund tokens if it was a paid session
    if (session.tokenCost > 0) {
      const learner = await User.findByPk(session.learnerId);
      if (learner) {
        await learner.update(
          {
            tokenBalance: learner.tokenBalance + session.tokenCost,
            totalTokensSpent: learner.totalTokensSpent - session.tokenCost,
          },
          { transaction }
        );

        await TokenTransaction.create(
          {
            userId: learner.id,
            amount: session.tokenCost,
            type: TransactionType.REFUND,
            description: `Refund for cancelled session: ${session.title}`,
            referenceId: session.id,
            referenceType: 'session',
            balanceBefore: learner.tokenBalance,
            balanceAfter: learner.tokenBalance + session.tokenCost,
          },
          { transaction }
        );
      }
    }

    await session.update(
      {
        status: SessionStatus.CANCELLED,
        cancellationReason: reason,
        cancelledBy: req.userId!,
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      status: 'success',
      message: 'Session cancelled successfully',
      data: { session },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
