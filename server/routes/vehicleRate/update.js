const router = require('express').Router();
const VehicleRate = require('../../models/vehicleRate');
const checkAuth = require('../authorization/checkAuth');



router.patch('/:rateId',  checkAuth(), async (req, res, next) => {
    try {
        const {rateId} = req.params;

        const {
            exportLocation,
            destinationCountry,
            documentDeliveryFee,
            sedan, 
            camionetas, 
            medianos15, 
            medianos16, 
            grandes, 
            extragrandes, 
            motocicletas, 
            carga,
            documentFee,
            billofLadingFee,
            destinationBillofLadingFee,
            chargeFee,
            consolidationAddress,
            heatTreatPalletRequire,
            status,
            note
        } = req.body;

        const updateData = {};

        if(exportLocation)updateData.exportLocation = exportLocation;
        if(destinationCountry)updateData.destinationCountry = destinationCountry;
        if(documentDeliveryFee)updateData.documentDeliveryFee = documentDeliveryFee;
        if(sedan)updateData.sedan = sedan; 
        if(camionetas)updateData.camionetas = camionetas; 
        if(medianos15)updateData.medianos15 = medianos15; 
        if(medianos16)updateData.medianos16 = medianos16; 
        if(grandes)updateData.grandes = grandes; 
        if(extragrandes)updateData.extragrandes = extragrandes; 
        if(motocicletas)updateData.motocicletas = motocicletas; 
        if(carga)updateData.carga = carga;
        if(documentFee)updateData.documentFee = documentFee;
        if(billofLadingFee)updateData.billofLadingFee = billofLadingFee;
        if(destinationBillofLadingFee)updateData.destinationBillofLadingFee = destinationBillofLadingFee;
        if(chargeFee)updateData.chargeFee = chargeFee;
        if(consolidationAddress)updateData.consolidationAddress = consolidationAddress;
        if(heatTreatPalletRequire)updateData.heatTreatPalletRequire = heatTreatPalletRequire;
        if(status)updateData.status = status;     
        if(note)updateData.note = note;

        const rate = await VehicleRate.findOneAndUpdate({_id: rateId}, {$set: updateData}, {new: true});


        res.json({
            message: 'Vehicle Rate Company Information updated',
            data: rate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;