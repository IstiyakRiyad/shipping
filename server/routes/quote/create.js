const router = require('express').Router();
const Quote = require('../../models/quote');
const Rate = require('../../models/rate');
const createHttpError = require('http-errors');
const Agent = require('../../models/agent');



router.post('/', async (req, res, next) => {
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
        
        const rate = await Rate.findOne({_id: rateId});

        if(!rate) throw createHttpError(404, 'Rate not found');

        const volume = width * height * length * numberOfPallets;

        const exportAndFreight = {
            freightRate: volume * rate.freightRate,
            portFee: volume * rate.portFee,
            documentFee: rate.documentFee,
            billofLadingFee: rate.billofLadingFee,
            destinationBillofLadingFee: rate.destinationBillofLadingFee,
            chargeFee: rate.chargeFee,
            unit: 1,
            amount: (volume * rate.freightRate +  volume * rate.portFee + rate.documentFee + rate.billofLadingFee + rate.destinationBillofLadingFee) * (1+ rate.chargeFee / 100)
        }

        const agent = await Agent.findOne({status: 'Default'});

        let customAduanaServices;
        if(agent) {
            customAduanaServices = {
                classifyProduct: agent.classifyProduct,
                rojoSelective: agent.rojoSelective,
                review: agent.review,
                permitsCost: agent.permitsCost
            }
        }

        const quote = await new Quote({
            warehouse: rate.exportLocation,
            countryOfImport: rate.destinationCountry,
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
            phone,
            exportAndFreight,
            customAduanaServices,
            consolidationAddress: rate.consolidationAddress,
            heatTreatPalletRequire: rate.heatTreatPalletRequire
        }).save();


        res.json({
            message: 'Quote Information',
            data: quote
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;