import { Router } from 'express';
import {
  getMyTransactions,
  getTokenBalance,
  createTokenPurchase,
  handleStripeWebhook,
  claimDailyChallenge,
} from '../controllers/tokenController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/webhook', handleStripeWebhook);

router.use(protect);

router.get('/transactions', getMyTransactions);
router.get('/balance', getTokenBalance);
router.post('/purchase', createTokenPurchase);
router.post('/daily-challenge', claimDailyChallenge);

export default router;
