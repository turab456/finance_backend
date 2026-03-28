import express from 'express';
import { parseSmsController, getTransactionsController } from '../controllers/transaction.controller.js';

const router = express.Router();

// POST /transactions/parse
router.post('/parse', parseSmsController);

// GET /transactions?user_id=
router.get('/', getTransactionsController);

export default router;
