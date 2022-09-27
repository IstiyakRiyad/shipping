const router = require('express').Router();
const Agent = require('../../models/agent');
const checkAuth = require('../authorization/checkAuth');



router.get('/', checkAuth(), async (req, res, next) => {
    try {

        const agent = await Agent.find(
            {}, 
            {
                customAgentName: 1, 
                customAgentAddress: 1,
                country: 1, 
                supportEmail: 1,
                enterPhoneNumber: 1,
                vehicleRate: 1,
                status: 1
            }
        );


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