const router = require('express').Router();
const Quote = require('../../models/quote');
const Rate = require('../../models/rate');
const createHttpError = require('http-errors');
const Agent = require('../../models/agent');
const calculatePallet = require('../../utils/calculatePallet');


router.post('/', async (req, res, next) => {
    try {
        const {
            // warehouse,
            // countryOfImport,
            rateId,
            pallets,
            typeOfMerchandise,
            commercialInvoice,
            statusOfShipment,
            collectionTransport,
            description,
            name,
            email,
            phone
        } = req.body;
        
        const rate = await Rate.findOne({_id: rateId});

        if(!rate) throw createHttpError(404, 'Rate not found');

        const volume = calculatePallet(pallets);

        const exportAndFreight = {
            id: rate._id,
            freightRate: rate.freightRate,
            portFee: rate.portFee,
            documentFee: rate.documentFee,
            billofLadingFee: rate.billofLadingFee,
            destinationBillofLadingFee: rate.destinationBillofLadingFee,
            chargeFee: rate.chargeFee,
            unit: 1,
            amount: ( volume * rate.freightRate +  volume * rate.portFee + rate.documentFee + rate.billofLadingFee ) * (1+ rate.chargeFee / 100)
        }

        const agent = await Agent.findOne({status: 'Default'});

        let customAduanaServices;
        if(agent) {
            customAduanaServices = {
                id: agent._id,
                classifyProduct: agent.classifyProduct,
                rojoSelective: agent.rojoSelective,
                review: agent.review,
                permitsCost: agent.permitsCost,
                unit: 1,
                amount: agent.classifyProduct
            }
        }

        const quote = await new Quote({
            warehouse: rate.exportLocation,
            countryOfImport: rate.destinationCountry,
            pallets,
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