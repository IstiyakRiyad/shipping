const router = require('express').Router();
const Vehicle = require('../../models/vehicle');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:vehicleId', checkAuth(), async (req, res, next) => {
    try {
        const {vehicleId} = req.params;

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

        const vehicle = await Vehicle.findOneAndUpdate({_id: vehicleId}, {$set: updateData}, {new: true});


        res.json({
            message: 'Vehicle Company Information updated',
            data: vehicle
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;