import express from 'express';
import {
  generateDiagram,
  getDiagrams,
  saveDiagram,
} from '../controllers/diagramController.js';

const router = express.Router();

router.post('/generate', generateDiagram);
router.get('/:userId', getDiagrams);
router.post('/', saveDiagram);

export default router;
