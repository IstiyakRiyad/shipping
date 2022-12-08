const router = require('express').Router();
const AfqRate = require('../../models/afqRate');
const checkAuth = require('../authorization/checkAuth');



router.post('/:partnerId', checkAuth(), async (req, res, next) => {
    try {
        const {partnerId} = req.params;

        const {
            exportLocation,
            destinationCountry,
            airFreightRate,
            airPortTransferFee,
            documentFee,
            billofLadingFee,
            // destinationBillofLadingFee,
            chargeFee,
            consolidationAddress,
            heatTreatPalletRequire,
            status,
            note
        } = req.body;
        
        const afqRate = await new AfqRate({
            partnerId,
            exportLocation,
            destinationCountry,
            airFreightRate,
            airPortTransferFee,
            documentFee,
            billofLadingFee,
            // destinationBillofLadingFee,
            chargeFee,
            consolidationAddress,
            heatTreatPalletRequire,
            status,
            note
        }).save();


        res.json({
            message: 'Rate Company Information',
            data: afqRate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;