const router = require('express').Router();


const auth = require('./auth');
const lcl = require('./lcl');


router.use('/auth', auth);
router.use('/lcl', lcl);


module.exports = router;