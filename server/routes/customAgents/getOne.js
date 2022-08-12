const router = require('express').Router();
const Agent = require('../../models/agent');



router.get('/:agentId', async (req, res, next) => {
    try {
        const {agentId} = req.params;

        const agent = await Agent.findOne({_id: agentId}, {__v: 0});


        // Rates
        

        res.json({
            message: 'One Agent Company Information',
            data: agent
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;