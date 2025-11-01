import { Router } from 'express';
import {
  createSession,
  createSessionValidation,
  getMySessions,
  getSessionById,
  startSession,
  endSession,
  cancelSession,
} from '../controllers/sessionController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', createSessionValidation, createSession);
router.get('/', getMySessions);
router.get('/:id', getSessionById);
router.post('/:id/start', startSession);
router.post('/:id/end', endSession);
router.post('/:id/cancel', cancelSession);

export default router;
