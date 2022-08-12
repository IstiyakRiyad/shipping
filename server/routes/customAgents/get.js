const router = require('express').Router();
const Agent = require('../../models/agent');



router.get('/', async (req, res, next) => {
    try {

        const agent = await Agent.find({}, {__v: 0});


        res.json({
            message: 'All Agent Company Information',
            data: agent
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;