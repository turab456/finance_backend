import express from 'express';
import { createUserController, getUserController, updateUserController, deleteUserController } from '../controllers/user.controller.js';

const router = express.Router();

// POST /users
router.post('/', createUserController);

// GET /users/:id
router.get('/:id', getUserController);

// PUT /users/:id
router.put('/:id', updateUserController);

// DELETE /users/:id
router.delete('/:id', deleteUserController);

export default router;