import express from 'express';
import { signup, login, logout } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', authenticate, logout);

export default router;
