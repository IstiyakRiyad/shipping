const createError = require('http-errors');
const {verifyToken} = require('../../utils/jwtUtils');


const checkAuth = () => {
    return async (req, res, next) => {
        try {
            const {token} = req.signedCookies;

            if(!token) throw createHTTPError(401, 'Token is required');

            const payload = await verifyToken(token);

            if(!payload) throw createHTTPError(401, 'User not found');

            req.user = {
                userId: payload.userId
            }

            return next();
        }
        catch(error) {
            next(error);
        }
    }
}


module.exports = checkAuth;