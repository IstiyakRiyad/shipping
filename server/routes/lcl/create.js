const router = require('express').Router();
const Lcl = require('../../models/lcl');
const checkAuth = require('../authorization/checkAuth');



router.post('/', checkAuth(), async (req, res, next) => {
    try {
        const {
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber
        } = req.body;
        
        const lcl = await new Lcl({
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber
        }).save();


        res.json({
            message: 'LCL Company Information',
            data: lcl
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;