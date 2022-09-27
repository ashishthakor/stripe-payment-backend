const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = await jwt.verify(token, SECRET);
        console.log(decodedToken);
        if (!decodedToken || !decodedToken.id) {
            return res.status(400).send('Invalid Request');
        }
        req.userId = decodedToken.id;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Request');
    }
}