const createHTTPError = require('http-errors');
const {verifyToken} = require('../../utils/jwtUtils');

const checkAuth = () => {
    return async (req, res, next) => {
        try {
            const {authorization} = req.headers;
            if(!authorization) throw createHTTPError(401, 'Authorization code required');
    
            const token = authorization.split(' ');

            // Cut the bearer token and find the token portion
            if(token[0] !== 'Bearer') throw createHTTPError(401, 'Bearer Token is required');
    
            // Verify and find the user id
            const {userId, exp} = await verifyToken(token[token.length - 1]);
    
                // check if the token is expired
            if(exp * 1000 < Date.now()) throw createHTTPError(401, 'Token is expried');
            
            req.user = { 
                userId 
            };

            return next();

        }
        catch(error) {
            next(error);
        }
    }
}


module.exports = checkAuth;