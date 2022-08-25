const router = require('express').Router();
const Quote = require('../../models/quote');
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');
const createHttpError = require('http-errors');
const Agent = require('../../models/agent');
const calculatePallet = require('../../utils/calculatePallet');



router.patch('/:quoteId', checkAuth(), async (req, res, next) => {
    try {
        const {quoteId} = req.params;

        const {
            pickupTransportation,
            ecommerceLogisticServices,
            deliveryToClient,
            rate,
            pallets,
            agent,
            otherCosts,
            tax,
            confirmation,
            description,
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
        if(description) updateData.description = description;
        if(pallets) updateData.pallets = pallets;


        if(rate) {
            const {idChanged} = rate;

            const oldQuote = await Quote.findOne({_id: quoteId});

            if(!oldQuote) throw createHttpError(404, 'Quote Not Found');

            const rateData = await Rate.findOne({_id: rate.id});

            if(!rateData) throw createHttpError(404, 'Rate not found');

            let volume;
            if(pallets) {
                volume = calculatePallet(pallets);
            }
            else {
                volume = calculatePallet(oldQuote.pallets);
            }

            if(idChanged) {
                updateData.exportAndFreight = {
                    id: rateData.id,
                    freightRate: rateData.freightRate,
                    portFee: rateData.portFee,
                    documentFee: rateData.documentFee,
                    billofLadingFee: rateData.billofLadingFee,
                    destinationBillofLadingFee: rateData.destinationBillofLadingFee,
                    chargeFee: rateData.chargeFee,
                    unit: rate.unit,
                    amount: (volume * rateData.freightRate +  volume * rateData.portFee + rateData.documentFee + rateData.billofLadingFee ) * (1+ rateData.chargeFee / 100) * rate.unit
                }
            }
            else {
                updateData.exportAndFreight = {
                    id: rate.id,
                    freightRate: rate.freightRate,
                    portFee: rate.portFee,
                    documentFee: rate.documentFee,
                    billofLadingFee: rate.billofLadingFee,
                    destinationBillofLadingFee: rate.destinationBillofLadingFee,
                    chargeFee: rate.chargeFee,
                    unit: rate.unit,
                    amount: (volume * rate.freightRate +  volume * rate.portFee + rate.documentFee + rate.billofLadingFee) * (1+ rate.chargeFee / 100) * rate.unit
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
                    classifyProduct: agentData.classifyProduct,
                    rojoSelective: agentData.rojoSelective,
                    review: agentData.review,
                    permitsCost: agentData.permitsCost,
                    unit: agent.unit,
                    amount: agentData.classifyProduct * agent.unit,
                }
            }
            else if(agentData) {
                updateData.customAduanaServices = {
                    classifyProduct: agent.classifyProduct,
                    rojoSelective: agent.rojoSelective,
                    review: agent.review,
                    permitsCost: agent.permitsCost,
                    id: agentData._id,
                    unit: agent.unit,
                    amount: agent.classifyProduct * agent.unit
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