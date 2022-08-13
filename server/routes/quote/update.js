const router = require('express').Router();
const Quote = require('../../models/quote');
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');
const createHttpError = require('http-errors');
const Agent = require('../../models/agent');


router.patch('/:quoteId', checkAuth(), async (req, res, next) => {
    try {
        const {quoteId} = req.params;

        const {
            pickupTransportation,
            ecommerceLogisticServices,
            deliveryToClient,
            rate,
            agent,
            otherCosts,
            tax,
            confirmation,
            status
        } = req.body;
        
        const updateData = {};

        if(pickupTransportation) updateData.pickupTransportation = pickupTransportation;
        if(ecommerceLogisticServices) updateData.ecommerceLogisticServices = ecommerceLogisticServices;
        if(deliveryToClient) updateData.deliveryToClient = deliveryToClient;
        if(tax) updateData.tax = tax;
        if(confirmation) updateData.confirmation = confirmation;
        if(status) updateData.status = status;  


        if(rate) {
            const oldQuote = await Quote.findOne({_id: quoteId});

            if(!oldQuote) throw createHttpError(404, 'Quote Not Found');

            const rateData = await Rate.findOne({_id: rate.id});

            if(!rateData) throw createHttpError(404, 'Rate not found');

            const {width, height, length, numberOfPallets} = oldQuote;
            
            const volume = width * height * length * numberOfPallets;

            updateData.exportAndFreight = {
                id: rateData._id,
                freightRate: rateData.freightRate,
                portFee: rateData.portFee,
                documentFee: rateData.documentFee,
                billofLadingFee: rateData.billofLadingFee,
                destinationBillofLadingFee: rateData.destinationBillofLadingFee,
                chargeFee: rateData.chargeFee,
                unit: rate.unit,
                amount: rate.amount //(volume * rate.freightRate +  volume * rate.portFee + rate.documentFee + rate.billofLadingFee + rate.destinationBillofLadingFee) * (1+ rate.chargeFee / 100)
            }
            updateData.warehouse = rateData.warehouse;
            updateData.countryOfImport = rateData.countryOfImport;
            updateData.consolidationAddress = rateData.consolidationAddress;
            updateData.heatTreatPalletRequire = rateData.heatTreatPalletRequire;
        }


        if(agent) {
            const agentData = await Agent.findOne({_id: agent.id});

            if(agentData) {
                updateData.customAduanaServices = {
                    id: agentData._id,
                    classifyProduct: agentData.classifyProduct,
                    rojoSelective: agentData.rojoSelective,
                    review: agentData.review,
                    permitsCost: agentData.permitsCost,
                    unit: agent.unit,
                    amount: agent.amount
                }
            }
        }

        const quote = await Quote.findOneAndUpdate({_id: quoteId}, {$set: updateData, $push: {otherCosts}}, {new: true});

        res.json({
            message: 'Quote Information updated',
            data: quote
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;