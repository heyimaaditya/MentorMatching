const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateBody } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', validateBody(['username', 'email', 'password']), register);
router.post('/login', validateBody(['email', 'password']), login);

module.exports = router;
