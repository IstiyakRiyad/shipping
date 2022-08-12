const router = require('express').Router();
const Agent = require('../../models/agent');
const checkAuth = require('../authorization/checkAuth');



router.post('/', checkAuth(), async (req, res, next) => {
    try {
        const {
            customAgentName,
            customAgentAddress,
            supportEmail,
            enterPhoneNumber,
            country,
            classifyProduct,
            rojoSelective,
            review,
            permitsCost
        } = req.body;
        
        const agent = await new Agent({
            customAgentName,
            customAgentAddress,
            supportEmail,
            enterPhoneNumber,
            country,
            classifyProduct,
            rojoSelective,
            review,
            permitsCost
        }).save();


        res.json({
            message: 'Agent Company Information',
            data: agent
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;