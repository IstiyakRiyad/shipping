const router = require('express').Router();
const Afq = require('../../models/afq');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:afqId', checkAuth(), async (req, res, next) => {
    try {
        const {afqId} = req.params;

        const {
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber,
            status,
            note
        } = req.body;

        let updateData = {};

        if(companyName) updateData.companyName = companyName
        if(companyAddress) updateData.companyAddress = companyAddress;
        if(salesEmail) updateData.salesEmail = salesEmail;
        if(supportEmail) updateData.supportEmail = supportEmail;
        if(enterPhoneNumber) updateData.enterPhoneNumber = enterPhoneNumber;
        if(status) updateData.status = status;
        if(note) updateData.note = note;

        const afq = await Afq.findOneAndUpdate({_id: afqId}, {$set: updateData}, {new: true});


        res.json({
            message: 'Afq Company Information updated',
            data: afq
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;