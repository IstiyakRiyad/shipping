const router = require('express').Router();
const Lcl = require('../../models/lcl');
const checkAuth = require('../authorization/checkAuth');


router.post('/', checkAuth(), async (req, res, next) => {
    try {
        const {
            // warehouse,
            // countryOfImport,
            rateId,
            length,
            width,
            height,
            weight,
            numberOfPallets,
            typeOfMerchandise,
            commercialInvoice,
            statusOfShipment,
            collectionTransport,
            name,
            email,
            phone
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