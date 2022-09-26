const router = require('express').Router();
const User = require('../../models/user');
const {verifyToken} = require('../../utils/jwtUtils');


router.post('/', async (req, res, next) => {
    try {
        const {token} = req.signedCookies;

        // Verify the refresh Token
        await verifyToken(token);

        // Clear the cookie
        res.clearCookie('token', {
            path: `api/v1/`,
            // sameSite: 'None',
        });


        res.json({
            message: 'Logout successfully'
        });

    }
    catch(error) {
        next(error);
    }
});



module.exports = router;