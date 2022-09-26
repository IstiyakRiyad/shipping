const router = require('express').Router();
const Vehicle = require('../../models/vehicle');
const checkAuth = require('../authorization/checkAuth');



router.post('/', checkAuth(), async (req, res, next) => {
    try {
        const {
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber,
            note
        } = req.body;
        
        const vehicle = await new Vehicle({
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber,
            note
        }).save();


        res.json({
            message: 'Vehicle Company Information',
            data: vehicle
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;