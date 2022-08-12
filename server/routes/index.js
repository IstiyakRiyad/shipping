const router = require('express').Router();


const auth = require('./auth');
const lcl = require('./lcl');
const agent = require('./customAgents');
const rate = require('./rate');



router.use('/auth', auth);
router.use('/lcl', lcl);
router.use('/agent', agent);
router.use('/rate', rate);


module.exports = router;