import express from 'express';
import { parseSmsController, getTransactionsController } from '../controllers/transaction.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth to all transaction routes
router.use(authMiddleware);

// POST /transactions/parse
router.post('/parse', parseSmsController);

// GET /transactions (userId now extracted from token)
router.get('/', getTransactionsController);

export default router;
