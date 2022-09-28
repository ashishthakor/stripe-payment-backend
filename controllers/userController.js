const User = require('../modals/user');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');
const stripe = require('../helpers/stripe.helper');

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

        const stripeCustomers = await stripe.listAllCustomer(email); // checking whether user available in stripe based on this id if then no need to create new customer in stripe(it is optional)
        let user;
        if (stripeCustomers.data.length > 0) {
            user = new User({ ...req.body, stripe_customer_id: stripeCustomers.data[0].id }); // create instance of modal/schema
        }
        else {
            const stripeUser = await stripe.createCustomer(email, name);
            if (!stripeUser) {
                return res.status(500).json({ message: 'Error while creating stripe customer' });
            }
            user = new User({ ...req.body, stripe_customer_id: stripeUser.id }); // create instance of modal/schema
        }
        const savedUser = await user.save(); // save the user to database

        const token = await jwt.sign({ user: savedUser }, SECRET); // generate token based on user

        return res.json({ message: 'User Created SuccessFully', data: { id: savedUser._id, name: savedUser.name, email: savedUser.email, stripe_customer_id: savedUser.stripe_customer_id, token } });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message || 'Server Error' });
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
                const token = await jwt.sign({ user: userExist }, SECRET);
                return res.status(200).json({ message: 'User Login SuccessFully', data: { id: userExist._id, name: userExist.name, email: userExist.email, stripe_customer_id: userExist.stripe_customer_id, token } });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }
        return res.status(400).json({ message: 'User Does not Exist' });
    } catch (err) {

    }
}

const generateCardToken = async (card) => { // generate a token for the card
    try {
        return await stripe.createCardToken(card);
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Error while generating token for card' });
    }
}

const createCardController = async (req, res) => {
    try {
        const { card } = req.body; // card object: { number, exp_month, exp_year, cvc}

        if (!card || !card.number || !card.exp_month || !card.exp_year || !card.cvc) {
            return res.status(400).json({ message: 'Please pass card Informatoin' }); // return if any of attribute is missing
        }

        const cardToken = await generateCardToken(card);
        if (cardToken) {

            const card = await stripe.createCard(req.user.stripe_customer_id, cardToken.id); // creating card to stripe_customer_id in stripe
            await User.findByIdAndUpdate(req.user._id, { $push: { cards: card.id } }) // add that card id to mongodb database in our user modal

            return res.status(200).json({ message: 'Card Create Successfully', data: { card } });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server Error' });
    }
}

module.exports = { userRegisterController, userLoginController, createCardController };