import express from 'express';
import {
  generateDiagram,
  getDiagrams,
  saveDiagram,
} from '../controllers/diagramController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All diagram routes require authentication
router.post('/generate', authenticate, generateDiagram);
router.get('/:userId', authenticate, getDiagrams);
router.post('/', authenticate, saveDiagram);

export default router;
