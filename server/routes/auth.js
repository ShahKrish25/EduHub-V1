const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);

module.exports = router;
