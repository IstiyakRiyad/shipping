const router = require('express').Router();
const Lcl = require('../../models/lcl');



router.patch('/:lclId', async (req, res, next) => {
    try {
        const {lclId} = req.params;
console.log(lclId)
        const {
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber
        } = req.body;

        let updateData = {};

        if(companyName) updateData.companyName = companyName
        if(companyAddress) updateData.companyAddress = companyAddress;
        if(salesEmail) updateData.salesEmail = salesEmail;
        if(supportEmail) updateData.supportEmail = supportEmail;
        if(enterPhoneNumber) updateData.enterPhoneNumber = enterPhoneNumber;


        const lcl = await Lcl.findOneAndUpdate({_id: lclId}, {$set: updateData});


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