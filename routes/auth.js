const express = require('express');
const { userRegisterController } = require('../controllers/userController');
const router = express.Router();

router.post('/register', userRegisterController);

router.post('/login', (req, res) => {

});

module.exports = router;