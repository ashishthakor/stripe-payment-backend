const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCustomer = async (email, name) => {
    return await stripe.customers.create({
        email, name
    })
}