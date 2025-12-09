const express = require('express');
const router = express.Router();
const {
  generateDiagram,
  getDiagrams,
} = require('../controllers/diagramController');

router.post('/generate', generateDiagram);
router.get('/:userId', getDiagrams);

module.exports = router;
