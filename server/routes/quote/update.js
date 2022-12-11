const router = require('express').Router();
const Quote = require('../../models/quote');
const checkAuth = require('../authorization/checkAuth');
const createHttpError = require('http-errors');
const {vehicleRateUpdate} = require('../../lib/vehicleQuote');
const {lclRateUpdate} = require('../../lib/lclQuote');
const {afqRateUpdate} = require('../../lib/afqQuote');
const {agentUpdate} = require('../../lib/agent');



router.patch('/:quoteId', checkAuth(), async (req, res, next) => {
    try {
        const {quoteId} = req.params;

        const {
            pickupTransportation,
            ecommerceLogisticServices,
            deliveryToClient,
            rate,
            pallets,
            unitType,
            agent,
            otherCosts,
            tax,
            confirmation,
            description,
            status,
            id,

            // Vehicle
            vehicleYear,
            VINNumber,
            vehicleSize,
            knowAduanaServices,
            startAndDrive,
            vehicleModel,

            // FCL
            containerType,
            origin,
            originExtra,
            destination,
            destinationExtra,

            // AFQ
            isDangerous,
            pickupFromOrigin,
            deliveryAtDestination
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
        if(unitType) updateData.unitType = unitType;

        // Vehicle
        if(vehicleYear) updateData.vehicleYear = vehicleYear;
        if(VINNumber) updateData.VINNumber = VINNumber;
        if(vehicleSize) updateData.vehicleSize = vehicleSize;
        if(knowAduanaServices) updateData.knowAduanaServices = knowAduanaServices;
        if(startAndDrive) updateData.startAndDrive = startAndDrive;
        if(vehicleModel) updateData.vehicleModel = vehicleModel;

        // FCL
        if(containerType) updateData.containerType = containerType; 
        if(origin) updateData.origin = origin; 
        if(originExtra) updateData.originExtra = originExtra; 
        if(destination) updateData.destination = destination; 
        if(destinationExtra) updateData.destinationExtra = destinationExtra; 

        // AFQ
        if(isDangerous) updateData.isDangerous = isDangerous;
        if(pickupFromOrigin) updateData.pickupFromOrigin = pickupFromOrigin;
        if(deliveryAtDestination) updateData.deliveryAtDestination = deliveryAtDestination;


        const oldQuote = await Quote.findOne({_id: quoteId});

        if(!oldQuote) throw createHttpError(404, 'Quote Not Found');
        const {type} = oldQuote;

        if(rate) {
            switch(type) {
                case 'AFQ': 
                    const afqUpdate = await afqRateUpdate(req, oldQuote);

                    updateData = {...updateData, ...afqUpdate};
                    break;
                case 'Vehicle': 
                    const vehicleRate = await vehicleRateUpdate(req);

                    updateData = {...updateData, ...vehicleRate};
                    break;
                default:
                    const lclRate = await lclRateUpdate(req, oldQuote);

                    updateData = {...updateData, ...lclRate};
            }
        }


        if(agent) {
            const agentUpdates = await agentUpdate(req, type);

            updateData = {...updateData, ...agentUpdates};
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