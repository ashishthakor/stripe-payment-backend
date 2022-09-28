const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCustomer = async (email, name) => {
    return await stripe.customers.create({
        email, name
    })
}

exports.createCardToken = async (card) => {
    return await stripe.tokens.create({ card });
}

exports.createCard = async (custId, tokenId) => {
    return await stripe.customers.createSource(custId, { source: tokenId });
}