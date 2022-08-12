const router = require('express').Router();
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:rateId',  checkAuth(), async (req, res, next) => {
    try {
        const {rateId} = req.params;

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
            status
        } = req.body;

        const updateData = {};

        if(exportLocation)updateData.exportLocation = exportLocation;
        if(destinationCountry)updateData.destinationCountry = destinationCountry;
        if(freightRate)updateData.freightRate = freightRate;
        if(portFee)updateData.portFee = portFee;
        if(documentFee)updateData.documentFee = documentFee;
        if(billofLadingFee)updateData.billofLadingFee = billofLadingFee;
        if(destinationBillofLadingFee)updateData.destinationBillofLadingFee = destinationBillofLadingFee;
        if(chargeFee)updateData.chargeFee = chargeFee;
        if(consolidationAddress)updateData.consolidationAddress = consolidationAddress;
        if(heatTreatPalletRequire)updateData.heatTreatPalletRequire = heatTreatPalletRequire;
        if(status)updateData.status = status;     


        const rate = await Rate.findOneAndUpdate({_id: rateId}, {$set: updateData}, {new: true});


        res.json({
            message: 'Rate Company Information updated',
            data: rate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;