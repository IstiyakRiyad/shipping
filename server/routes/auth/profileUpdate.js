const router = require('express').Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const checkAuth = require('../authorization/checkAuth');
const createError = require('http-errors');

router.patch('/', checkAuth(), async (req, res, next) => {
    try {
        const {userId} = req.user;
        
        const {
            name, 
            password, 
            oldPassword, 
            email
        } = req.body;

        const updateInfo = {};
        
        // Check if name and address is given
        if(name) updateInfo.name = name;
        if(email) updateInfo.email = email;

        if(password && oldPassword) {
            const user = await User.findOne({_id: userId});
            
            const valid = await bcrypt.compare(oldPassword, user.password);

            if(!valid) throw createError(422, 'Invalid Password');

            updateInfo.password = await bcrypt.hash(password, 12);
        }

        const user = await User.findOneAndUpdate({_id: userId}, {$set: updateInfo}, {returnDocument: 'after'});
        
        const userData = user.toJSON();

        delete userData.password;

        res.json({
            message: 'Profile is updated successfully',
            data: userData
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;