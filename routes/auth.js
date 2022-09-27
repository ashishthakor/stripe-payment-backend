const express = require('express');
const { userRegisterController, userLoginController } = require('../controllers/userController');
const router = express.Router();

router.post('/register', userRegisterController);

router.post('/login', userLoginController);

module.exports = router;