const router = require('express').Router();

const create = require('./create');
const update = require('./update');
const getOne = require('./getOne');
const getAll = require('./get');
const deleteOne = require('./delete');



router.use('/', create);
router.use('/', update);
router.use('/one', getOne);
router.use('/', getAll);
router.use('/', deleteOne);


module.exports = router;
