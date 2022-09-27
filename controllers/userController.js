const User = require('../modals/user');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const userRegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Invalid Parameter Passed' }); // return if any of attribute is missing
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User Already exists' }); // check if user already exists
        }

        req.body.password = await bcrypt.hash(req.body.password, 10); // encrypt password

        const user = new User(req.body); // create instance of modal/schema
        const savedUser = await user.save(); // save the user to database

        const token = await jwt.sign({ email: savedUser.email, id: savedUser._id }, SECRET); // generate token based on id and email

        return res.json({ message: 'User Created SuccessFully', data: { id: savedUser._id, name: savedUser.name, email: savedUser.email, token } });
    } catch (err) {
        console.log(err)
        res.status(400).json({ err });
    }
}

const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({ message: 'Invalid Parameter Passed' }); // return if any of attribute is missing
        }

        const userExist = await User.findOne({ email }); // check if the user exists
        if (userExist) {
            const match = await bcrypt.compare(req.body.password, userExist.password); // compare plain password with bycypt (encrypted stored) password

            if (match) {
                const token = await jwt.sign({ email: userExist.email, id: userExist._id }, SECRET);
                return res.status(200).json({ message: 'User Login SuccessFully', data: { id: userExist._id, name: userExist.name, email: userExist.email, token } });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }
        return res.status(400).json({ message: 'User Does not Exist' });
    } catch (err) {

    }
}
module.exports = { userRegisterController, userLoginController };