const User = require('../modals/user');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const userRegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Invalid Argument passed' });
        }

        const existingUser = await User.find({ email });
        console.log("existingUser", existingUser)
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User Already exists' })
        }

        req.body.password = await bcrypt.hash(req.body.password, 10);
        const token = await jwt.sign({ email: req.email }, SECRET);

        const user = await User.create({ ...req.body, token });

        return res.json({ id: user._id, name: user.name, email: user.email, token: user.token });
    } catch (err) {
        console.log(err)
        res.status(400).json({ err });
    }
}
module.exports = { userRegisterController };