import express from 'express';
import { getInsightsController } from '../controllers/insight.controller.js';

const router = express.Router();

// GET /insights?user_id=
router.get('/', getInsightsController);

export default router;
