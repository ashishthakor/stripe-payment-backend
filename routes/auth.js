const express = require('express');
const { userRegisterController, userLoginController, createCardController, setDefaultCardController, retrieveAllCardController, deleteCardController } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', userRegisterController);

router.post('/login', userLoginController);

router.post('/create-card', auth, createCardController);
router.post('/update-default-card', auth, setDefaultCardController);
router.get('/retrieve-cards', auth, retrieveAllCardController);
router.delete('/delete-card', auth, deleteCardController);

// router.get('/test', auth, (req, res) => {
//     console.log('in callback function')
//     console.log('user from middleware', req.user);
//     return res.status(200).send({ message: 'middleware applied successfully' })
// });

module.exports = router;