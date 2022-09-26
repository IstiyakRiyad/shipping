const router = require('express').Router();
const Lcl = require('../../models/lcl');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:lclId', checkAuth(), async (req, res, next) => {
    try {
        const {lclId} = req.params;

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

        const lcl = await Lcl.findOneAndUpdate({_id: lclId}, {$set: updateData}, {new: true});


        res.json({
            message: 'LCL Company Information updated',
            data: lcl
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;