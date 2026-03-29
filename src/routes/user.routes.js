import express from 'express';
import { 
  createUserController, 
  getUserController, 
  updateUserController, 
  deleteUserController,
  loginController,
  getMeController
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/', createUserController);
router.post('/login', loginController);

// Profile route (triggered when app opens)
router.get('/me', authMiddleware, getMeController);

// Protected routes (example, if you want others to be protected too)
router.get('/:id', authMiddleware, getUserController);
router.put('/:id', authMiddleware, updateUserController);
router.delete('/:id', authMiddleware, deleteUserController);

export default router;