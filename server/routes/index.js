const router = require('express').Router();


const auth = require('./auth');
const lcl = require('./lcl');
const agent = require('./customAgents');
const rate = require('./rate');
const quote = require('./quote');

const vehicle = require('./vehicle');
const vehicleRate = require('./vehicleRate');

const afq = require('./afq');
const afqRate = require('./afqRate');


router.use('/auth', auth);
router.use('/lcl', lcl);
router.use('/agent', agent);
router.use('/rate', rate);
router.use('/quote', quote);
router.use('/vehicle', vehicle);
router.use('/vehicleRate', vehicleRate);
router.use('/afq', afq);
router.use('/afqRate', afqRate);


module.exports = router;