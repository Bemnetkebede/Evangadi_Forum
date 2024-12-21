const jwt = require('jsonwebtoken')

function authMiddleWare (req, res , next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ msg: 'Authentication token is missing or invalid.' })
    }

    const token = authHeader.split(' ')[1]
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        req.user = { username: decode.username, userID: decode.userID };
        // req.user = { username, userid };
        next()
    }
    catch(err){
        return res.status(401).json({ message: 'Token is invalid' });
    }
} 

module.exports = authMiddleWare