import { Router } from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  refreshTokenHandler,
} from '../controllers/authController';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshTokenHandler);

export default router;
