import { Router } from 'express';
import {
  getMe,
  updateMe,
  updateMeValidation,
  getUserById,
  searchUsers,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMeValidation, updateMe);
router.get('/search', searchUsers);
router.get('/:id', getUserById);

export default router;
