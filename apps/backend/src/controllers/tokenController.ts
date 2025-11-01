import { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import TokenTransaction, { TransactionType } from '../models/TokenTransaction';
import User from '../models/User';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export const getMyTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, type } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  const whereClause: any = { userId: req.userId! };

  if (type) {
    whereClause.type = type;
  }

  const { rows: transactions, count } = await TokenTransaction.findAndCountAll({
    where: whereClause,
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    status: 'success',
    data: {
      transactions,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    },
  });
});

export const getTokenBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.userId!);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: {
      balance: user.tokenBalance,
      totalEarned: user.totalTokensEarned,
      totalSpent: user.totalTokensSpent,
    },
  });
});

export const createTokenPurchase = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount } = req.body; // Number of tokens to purchase

  if (!amount || amount < 1) {
    throw new AppError('Invalid token amount', 400);
  }

  // Price: $1 = 10 tokens (you can adjust this)
  const priceInCents = Math.round((amount / 10) * 100);

  const user = await User.findByPk(req.userId!);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: priceInCents,
    currency: 'usd',
    metadata: {
      userId: user.id,
      tokenAmount: amount.toString(),
    },
  });

  res.json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.client_secret,
      amount,
      price: priceInCents / 100,
    },
  });
});

export const handleStripeWebhook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.userId;
    const tokenAmount = parseInt(paymentIntent.metadata.tokenAmount);

    const user = await User.findByPk(userId);
    if (user) {
      const balanceBefore = user.tokenBalance;

      await user.update({
        tokenBalance: user.tokenBalance + tokenAmount,
        totalTokensEarned: user.totalTokensEarned + tokenAmount,
      });

      await TokenTransaction.create({
        userId: user.id,
        amount: tokenAmount,
        type: TransactionType.PURCHASED,
        description: `Purchased ${tokenAmount} tokens`,
        balanceBefore,
        balanceAfter: user.tokenBalance + tokenAmount,
        metadata: {
          paymentIntentId: paymentIntent.id,
          amountPaid: paymentIntent.amount / 100,
        },
      });
    }
  }

  res.json({ received: true });
});

export const claimDailyChallenge = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.userId!);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if user already claimed today
  const existingClaim = await TokenTransaction.findOne({
    where: {
      userId: user.id,
      type: TransactionType.EARNED_CHALLENGE,
      createdAt: { [Op.gte]: today },
    },
  });

  if (existingClaim) {
    throw new AppError('Daily challenge already claimed today', 400);
  }

  const tokensEarned = parseInt(process.env.DAILY_CHALLENGE_TOKENS || '10');
  const balanceBefore = user.tokenBalance;

  await user.update({
    tokenBalance: user.tokenBalance + tokensEarned,
    totalTokensEarned: user.totalTokensEarned + tokensEarned,
  });

  await TokenTransaction.create({
    userId: user.id,
    amount: tokensEarned,
    type: TransactionType.EARNED_CHALLENGE,
    description: 'Daily challenge completed',
    balanceBefore,
    balanceAfter: user.tokenBalance + tokensEarned,
  });

  res.json({
    status: 'success',
    data: {
      tokensEarned,
      newBalance: user.tokenBalance + tokensEarned,
    },
  });
});

import { Op } from 'sequelize';
