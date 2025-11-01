import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import skillRoutes from './skillRoutes';
import sessionRoutes from './sessionRoutes';
import tokenRoutes from './tokenRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/sessions', sessionRoutes);
router.use('/tokens', tokenRoutes);

export default router;
