const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../middleware/multer');

const router = express.Router();

// /auth/signup
router.post('/signup', authController.auth_signup_post);

// /auth/login
router.post('/login', authController.auth_login_post);

// /auth/logout
router.get('/logout', authController.auth_logout_get);

// /auth/
router.get('/', authController.auth_get);

module.exports = router;
