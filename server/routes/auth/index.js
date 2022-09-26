const router = require('express').Router();

const login = require('./login');
const logout = require('./logout');
const profile = require('./profile');
const profileUpdate = require('./profileUpdate');



router.use('/login', login);
router.use('/logout', logout);
router.use('/profile', profile);
router.use('/profile', profileUpdate);


module.exports = router;
