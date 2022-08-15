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
            status,
            id
        } = req.body;
        
        const updateData = {};

        if(pickupTransportation) updateData.pickupTransportation = pickupTransportation;
        if(ecommerceLogisticServices) updateData.ecommerceLogisticServices = ecommerceLogisticServices;
        if(deliveryToClient) updateData.deliveryToClient = deliveryToClient;
        if(tax) updateData.tax = tax;
        if(confirmation) updateData.confirmation = confirmation;
        if(status) updateData.status = status; 
        if(id) updateData.id = id;  


        if(rate) {
            const {idChanged} = rate;

            const oldQuote = await Quote.findOne({_id: quoteId});

            if(!oldQuote) throw createHttpError(404, 'Quote Not Found');

            const rateData = await Rate.findOne({_id: rate.id});

            if(!rateData) throw createHttpError(404, 'Rate not found');

            const {width, height, length} = oldQuote;
            
            const volume = width * height * length / 1728 / 35.315;

            if(idChanged) {
                updateData.exportAndFreight = {
                    id: rateData._id,
                    unit: rate.unit,
                    amount: (volume * rateData.freightRate +  volume * rateData.portFee + rateData.documentFee + rateData.billofLadingFee ) * (1+ rateData.chargeFee / 100)
                }
            }
            else {
                updateData.exportAndFreight = {
                    id: rateData._id,
                    unit: rate.unit,
                    amount: rate.amount //(volume * rate.freightRate +  volume * rate.portFee + rate.documentFee + rate.billofLadingFee + rate.destinationBillofLadingFee) * (1+ rate.chargeFee / 100)
                }
            }
            updateData.warehouse = rateData.warehouse;
            updateData.countryOfImport = rateData.countryOfImport;
            updateData.consolidationAddress = rateData.consolidationAddress;
            updateData.heatTreatPalletRequire = rateData.heatTreatPalletRequire;
        }


        if(agent) {
            const {idChanged} = agent;

            const agentData = await Agent.findOne({_id: agent.id});

            if(idChanged && agentData) {
                updateData.customAduanaServices = {
                    id: agentData._id,
                    unit: agent.unit,
                    amount: agentData.classifyProduct * agent.unit,
                }
            }
            else if(agentData) {
                updateData.customAduanaServices = {
                    id: agentData._id,
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