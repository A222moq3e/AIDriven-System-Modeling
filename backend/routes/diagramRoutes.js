import express from 'express';
import {
  generateDiagram,
  getDiagrams,
} from '../controllers/diagramController.js';

const router = express.Router();

router.post('/generate', generateDiagram);
router.get('/:userId', getDiagrams);

export default router;
