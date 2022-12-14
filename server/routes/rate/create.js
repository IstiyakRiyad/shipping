const router = require('express').Router();
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');



router.post('/:partnerId', checkAuth(), async (req, res, next) => {
    try {
        const {partnerId} = req.params;

        const {
            exportLocation,
            destinationCountry,
            freightRate,
            portFee,
            documentFee,
            billofLadingFee,
            destinationBillofLadingFee,
            chargeFee,
            consolidationAddress,
            heatTreatPalletRequire,
            status,
            note,
            // New
            documentFeeChina,
            clearanceFeeChina,
            vgmFeeChina,
            mainfestFeeChina,
            cfsFeeChina,
            ocFeeChina,
            oceanFreightFeeChina,
            destinationBillOfLadingFeeChina,
            collectFeeChina,
            rateType
        } = req.body;
        
        const rate = await new Rate({
            partnerId,
            exportLocation,
            destinationCountry,
            freightRate,
            portFee,
            documentFee,
            billofLadingFee,
            destinationBillofLadingFee,
            chargeFee,
            consolidationAddress,
            heatTreatPalletRequire,
            status,
            note,
            documentFeeChina,
            clearanceFeeChina,
            vgmFeeChina,
            mainfestFeeChina,
            cfsFeeChina,
            ocFeeChina,
            oceanFreightFeeChina,
            destinationBillOfLadingFeeChina,
            collectFeeChina,
            rateType
        }).save();


        res.json({
            message: 'Rate Company Information',
            data: rate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;