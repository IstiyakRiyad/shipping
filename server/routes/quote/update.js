const router = require('express').Router();
const Quote = require('../../models/quote');
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');
const createHttpError = require('http-errors');
const Agent = require('../../models/agent');
const calculatePallet = require('../../utils/calculatePallet');
const VehicleRate = require('../../models/vehicleRate');



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
            destinationExtra
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

        const oldQuote = await Quote.findOne({_id: quoteId});

        if(!oldQuote) throw createHttpError(404, 'Quote Not Found');
        const {type} = oldQuote;

        if(rate) {
            const {idChanged} = rate;
            let rateData;
            switch(type) {
                case 'Vehicle': 
                    rateData = await VehicleRate.findOne({_id: rate.id});

                    if(!rateData) throw createHttpError(404, 'Rate not found');
        
                    if(idChanged) {
                        updateData.exportAndFreight = {
                            id: rateData.id,
                            vehicleSize: rateData[vehicleSize],
                            documentDeliveryFee: rateData.documentDeliveryFee,
                            documentFee: rateData.documentFee,
                            billofLadingFee: rateData.billofLadingFee,
                            destinationBillofLadingFee: rateData.destinationBillofLadingFee,
                            chargeFee: rateData.chargeFee,
                            unit: rate.unit,
                            amount: (rateData[vehicleSize] + rateData.documentDeliveryFee + rateData.documentFee + rateData.billofLadingFee + rateData.destinationBillofLadingFee) * (1+ rateData.chargeFee / 100) * rate.unit
                        }
                    }
                    else {
                        updateData.exportAndFreight = {
                            id: rate.id,
                            vehicleSize: rate.vehicleSize,
                            documentDeliveryFee: rate.documentDeliveryFee,
                            documentFee: rate.documentFee,
                            billofLadingFee: rate.billofLadingFee,
                            destinationBillofLadingFee: rate.destinationBillofLadingFee,
                            chargeFee: rate.chargeFee,
                            unit: rate.unit,
                            amount: (rate.vehicleSize + rate.documentDeliveryFee + rate.documentFee + rate.billofLadingFee + rate.destinationBillofLadingFee) * (1+ rate.chargeFee / 100) * rate.unit
                        }
                    }
                    updateData.warehouse = rateData.warehouse;
                    updateData.countryOfImport = rateData.countryOfImport;
                    updateData.consolidationAddress = rateData.consolidationAddress;
                    updateData.heatTreatPalletRequire = rateData.heatTreatPalletRequire;
                    break;
                default:
                    rateData = await Rate.findOne({_id: rate.id});

                    if(!rateData) throw createHttpError(404, 'Rate not found');
                    
                    let volume, finalUnitType = unitType || oldQuote.unitType;

                    if(pallets) {
                        volume = calculatePallet(pallets, finalUnitType, rateData.rateType);
                    }
                    else {
                        volume = calculatePallet(oldQuote.pallets, finalUnitType, rateData.rateType);
                    }
                    updateData.qubic = volume;
        
                    if(idChanged) {
                        if(rateData.rateType === 'global') {
                            updateData.exportAndFreight = {
                                id: rateData.id,
                                rateType: rateData.rateType,
                                freightRate: rateData.freightRate,
                                portFee: rateData.portFee,
                                documentFee: rateData.documentFee,
                                billofLadingFee: rateData.billofLadingFee,
                                destinationBillofLadingFee: rateData.destinationBillofLadingFee,
                                chargeFee: rateData.chargeFee,
                                unit: rate.unit,
                                amount: (volume * rateData.freightRate +  volume * rateData.portFee + rateData.documentFee + rateData.billofLadingFee + rateData.destinationBillofLadingFee) * (1+ rateData.chargeFee / 100) * rate.unit
                            }
                        }
                        else if(rateData.rateType === 'china') {
                            updateData.exportAndFreight = {
                                id: rateData.id,
                                rateType: rateData.rateType,
                                documentFeeChina: rateData.documentFeeChina,
                                clearanceFeeChina: rateData.clearanceFeeChina,
                                vgmFeeChina: rateData.vgmFeeChina,
                                mainfestFeeChina: rateData.mainfestFeeChina,
                                cfsFeeChina: rateData.cfsFeeChina,
                                ocFeeChina: rateData.ocFeeChina,
                                oceanFreightFeeChina: rateData.oceanFreightFeeChina,
                                destinationBillOfLadingFeeChina: rateData.destinationBillOfLadingFeeChina,
                                collectFeeChina: rateData.collectFeeChina,
                                unit: rate.unit,
                                amount: (
                                    rateData.documentFeeChina +
                                    rateData.clearanceFeeChina +
                                    rateData.vgmFeeChina +
                                    rateData.mainfestFeeChina +
                                    volume * rateData.cfsFeeChina +
                                    volume * rateData.ocFeeChina +
                                    (volume * rateData.oceanFreightFeeChina +
                                    rateData.destinationBillOfLadingFeeChina ) * (1 + rateData.collectFeeChina / 100)
                                  ) * rate.unit
                            }
                        }
                        
                    }
                    else {
                        if(rateData.rateType === 'global') {
                            updateData.exportAndFreight = {
                                id: rate.id,
                                rateType: rateData.rateType,
                                freightRate: rate.freightRate,
                                portFee: rate.portFee,
                                documentFee: rate.documentFee,
                                billofLadingFee: rate.billofLadingFee,
                                destinationBillofLadingFee: rate.destinationBillofLadingFee,
                                chargeFee: rate.chargeFee,
                                unit: rate.unit,
                                amount: (volume * rate.freightRate +  volume * rate.portFee + rate.documentFee + rate.billofLadingFee + rate.destinationBillofLadingFee) * (1+ rate.chargeFee / 100) * rate.unit
                            }
                        } 
                        else if(rateData.rateType === 'china') {
                            updateData.exportAndFreight = {
                                id: rate.id,
                                rateType: rateData.rateType,
                                documentFeeChina: rate.documentFeeChina,
                                clearanceFeeChina: rate.clearanceFeeChina,
                                vgmFeeChina: rate.vgmFeeChina,
                                mainfestFeeChina: rate.mainfestFeeChina,
                                cfsFeeChina: rate.cfsFeeChina,
                                ocFeeChina: rate.ocFeeChina,
                                oceanFreightFeeChina: rate.oceanFreightFeeChina,
                                destinationBillOfLadingFeeChina: rate.destinationBillOfLadingFeeChina,
                                collectFeeChina: rate.collectFeeChina,
                                unit: rate.unit,
                                amount: (
                                    rate.documentFeeChina +
                                    rate.clearanceFeeChina +
                                    rate.vgmFeeChina +
                                    rate.mainfestFeeChina +
                                    volume * rate.cfsFeeChina +
                                    volume * rate.ocFeeChina +
                                    (volume * rate.oceanFreightFeeChina +
                                    rate.destinationBillOfLadingFeeChina) * (1 + rate.collectFeeChina / 100)
                                  ) * rate.unit
                            }
                        }
                        
                    }
                    updateData.warehouse = rateData.warehouse;
                    updateData.countryOfImport = rateData.countryOfImport;
                    updateData.consolidationAddress = rateData.consolidationAddress;
                    updateData.heatTreatPalletRequire = rateData.heatTreatPalletRequire;
                    break;
            }

            
        }


        if(agent) {
            const {idChanged} = agent;

            const agentData = await Agent.findOne({_id: agent.id});

            if(idChanged && agentData) {
                updateData.customAduanaServices = {
                    id: agentData._id,
                    vehicleRate: agentData.vehicleRate,
                    classifyProduct: agentData.classifyProduct,
                    rojoSelective: agentData.rojoSelective,
                    review: agentData.review,
                    permitsCost: agentData.permitsCost,
                    unit: agent.unit,
                    amount: (type == 'Vehicle') ? agentData.vehicleRate * agent.unit : agentData.classifyProduct * agent.unit,
                }
            }
            else if(agentData) {
                updateData.customAduanaServices = {
                    id: agent._id,
                    vehicleRate: agent.vehicleRate,
                    classifyProduct: agent.classifyProduct,
                    rojoSelective: agent.rojoSelective,
                    review: agent.review,
                    permitsCost: agent.permitsCost,
                    id: agentData._id,
                    unit: agent.unit,
                    amount: (type == 'Vehicle')? agent.vehicleRate * agent.unit : agent.classifyProduct * agent.unit
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