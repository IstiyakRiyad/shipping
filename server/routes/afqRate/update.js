const router = require('express').Router();
const AfqRate = require('../../models/afqRate');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:afqRateId',  checkAuth(), async (req, res, next) => {
    try {
        const {afqRateId} = req.params;

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

        const updateData = {};

        if(exportLocation)updateData.exportLocation = exportLocation;
        if(destinationCountry)updateData.destinationCountry = destinationCountry;
        if(airFreightRate)updateData.airFreightRate = airFreightRate;
        if(airPortTransferFee)updateData.airPortTransferFee = airPortTransferFee;
        if(documentFee)updateData.documentFee = documentFee;
        if(billofLadingFee)updateData.billofLadingFee = billofLadingFee;
        // if(destinationBillofLadingFee)updateData.destinationBillofLadingFee = destinationBillofLadingFee;
        if(chargeFee)updateData.chargeFee = chargeFee;
        if(consolidationAddress)updateData.consolidationAddress = consolidationAddress;
        if(heatTreatPalletRequire)updateData.heatTreatPalletRequire = heatTreatPalletRequire;
        if(status)updateData.status = status;     
        if(note)updateData.note = note;


        const afqrate = await AfqRate.findOneAndUpdate({_id: afqRateId}, {$set: updateData}, {new: true});


        res.json({
            message: 'AFQ Rate Company Information updated',
            data: afqrate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;