const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
function authMiddleWare(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Authentication token is missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { username: decode.username, userID: decode.userID }; 
        next();
    } catch (err) {
        console.error("Token Verification Error:", err.message);
        return res.status(401).json({ message: 'Token is invalid' });
    }
}

module.exports = authMiddleWare;
