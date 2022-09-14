const router = require('express').Router();
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const {signToken} = require('../../utils/jwtUtils');

router.post('/', async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // Check if user already exists
        const user = await User.findOne({email});

        if(!user) throw createError(401, 'Invalid Login');
        

        // Check Password
        const check = await bcrypt.compare(password, user.password);

        if(!check) throw createError(401, 'Invalid Login');


        // Create Refresh Token
        const token = await signToken({userId: user._id});

        // Set cookie to response
        res.cookie('token', token, {
            maxAge: 6307200000000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            // sameSite: 'None',
            path: `api/v1`,
            signed: true
        }); 

        
        res.json({
            message: 'Login successfully'
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;