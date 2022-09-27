const router = require('express').Router();
const Agent = require('../../models/agent');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:agentId', checkAuth(), async (req, res, next) => {
    try {
        const {agentId} = req.params;
        const {
            customAgentName,
            customAgentAddress,
            supportEmail,
            enterPhoneNumber,
            country,
            classifyProduct,
            rojoSelective,
            review,
            permitsCost,
            status,
            id,
            description,
            vehicleRate,
            note
        } = req.body;
        
        const updateData = {};

        if(customAgentName) updateData.customAgentName = customAgentName;
        if(customAgentAddress) updateData.customAgentAddress = customAgentAddress;
        if(supportEmail) updateData.supportEmail = supportEmail;
        if(enterPhoneNumber) updateData.enterPhoneNumber = enterPhoneNumber;
        if(country) updateData.country = country;
        if(classifyProduct) updateData.classifyProduct = classifyProduct;
        if(rojoSelective) updateData.rojoSelective = rojoSelective;
        if(review) updateData.review = review;
        if(permitsCost) updateData.permitsCost = permitsCost;
        if(status) updateData.status = status;
        if(vehicleRate) updateData.vehicleRate = vehicleRate;
        if(note) updateData.note = note;
        
        if(status === 'Default') {
            await Agent.findOneAndUpdate({status: 'Default'}, {$set: {status: 'Active'}});
        }
        if(id) updateData.id = id;
        if(description) updateData.description = description;

        const agent = await Agent.findOneAndUpdate({_id: agentId}, {$set: updateData}, {new: true});


        res.json({
            message: 'Agent Company Information updated',
            data: agent
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;