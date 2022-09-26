const router = require('express').Router();
const VehicleRate = require('../../models/vehicleRate');
const checkAuth = require('../authorization/checkAuth');



router.post('/:partnerId', checkAuth(), async (req, res, next) => {
    try {
        const {partnerId} = req.params;

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
        
        const vehicleRate = await new VehicleRate({
            partnerId,
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
        }).save();


        res.json({
            message: 'Vehicle Rate Company Information',
            data: vehicleRate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;