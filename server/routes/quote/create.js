const router = require("express").Router();
const Quote = require("../../models/quote");
const sendMail = require("../../utils/sendMail");
const { upload } = require('../../utils/storeImage');
const {lclQuote} = require('../../lib/lclQuote');
const {vehicleQuote} = require('../../lib/vehicleQuote');
const {afqQuote} = require('../../lib/afqQuote');





router.post("/", upload.single('image'), async (req, res, next) => {
    try {
        const {
            // warehouse,
            // countryOfImport,
            type,

            // AFQ
            isDangerous,
            pickupFromOrigin,
            deliveryAtDestination,

            // FCL
            containerType,
            origin,
            originExtra,
            destination,
            destinationExtra,


            // Vehicle Values
            vehicleYear,
            VINNumber,
            vehicleSize,
            knowAduanaServices,
            startAndDrive,
            vehicleModel,

            // LCL
            pallets,
            unitType,
            typeOfMerchandise,
            commercialInvoice,
            statusOfShipment,
            collectionTransport,
            description,

            // Default
            rateId,
            name,
            email,
            phone,
        } = req.body;

        let quoteData = {};
        if (type === 'Vehicle') {
            quoteData = await vehicleQuote(req);
        }
        else if (type === 'LCL') {
            quoteData = await lclQuote(req);
        }
        else if(type === 'AFQ') {
            quoteData = await afqQuote(req);
        }


        const {rate, exportAndFreight, customAduanaServices, image, volume} = quoteData;

        const quote = await new Quote({
            type,

            // AFQ
            isDangerous,
            pickupFromOrigin,
            deliveryAtDestination,

            // FCL
            containerType,
            origin,
            originExtra,
            destination,
            destinationExtra,

            warehouse: rate && rate.exportLocation,
            countryOfImport: rate && rate.destinationCountry,
            vehicleYear,
            VINNumber,
            vehicleSize,
            knowAduanaServices,
            startAndDrive,
            vehicleModel,
            image,

            pallets,
            unitType,
            qubic: volume,
            typeOfMerchandise,
            commercialInvoice,
            statusOfShipment,
            collectionTransport,
            description,
            name,
            email,
            phone,
            exportAndFreight,
            customAduanaServices,
            consolidationAddress: rate && rate.consolidationAddress,
            heatTreatPalletRequire: rate && rate.heatTreatPalletRequire,
        }).save();

        res.json({
            message: "Quote Information",
            data: quote,
        });

        await sendMail({
            to: "paulruet58@gmail.com, lissette@casaenvios.com, edwinp@casaenvios.com",
            subject: "Casaenvios Quote",
            template: "mailTemplate",
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
