const router = require('express').Router();


const auth = require('./auth');
const lcl = require('./lcl');
const agent = require('./customAgents');
const rate = require('./rate');
const quote = require('./quote');



router.use('/auth', auth);
router.use('/lcl', lcl);
router.use('/agent', agent);
router.use('/rate', rate);
router.use('/quote', quote);

module.exports = router;