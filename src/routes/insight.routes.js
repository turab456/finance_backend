import express from 'express';
import { getInsightsController } from '../controllers/insight.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth to insight routes
router.use(authMiddleware);

// GET /insights (userId now extracted from token)
router.get('/', getInsightsController);

export default router;
