const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/get-me', authMiddleware.protect, authController.getMe);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
