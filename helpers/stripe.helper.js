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

exports.listAllCustomer = async (email) => {
    return await stripe.customers.list({ email });
}

exports.listAllCard = async (custId) => {
    return await stripe.customers.listSources(custId, { object: 'card' });
}

exports.updateDefaultCard = async (custId, catdId) => {
    return await stripe.customers.update(custId, { default_source: catdId });
}