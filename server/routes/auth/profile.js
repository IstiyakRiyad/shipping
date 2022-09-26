const router = require('express').Router();
const User = require('../../models/user');
const checkAuth = require('../authorization/checkAuth');


router.get('/', checkAuth(), async (req, res, next) => {
    try {
        const {userId} = req.user;

        const user = await User.findOne({_id: userId}, {__v: 0, password: 0});

        res.json({
            message: 'User data',
            data: {
                user
            }
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;