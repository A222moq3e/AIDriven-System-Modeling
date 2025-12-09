const express = require('express');
const router = express.Router();
const { loginOrSignup } = require('../controllers/userController');

router.post('/auth', loginOrSignup);

module.exports = router;
