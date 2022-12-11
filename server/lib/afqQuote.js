const AFQRate = require("../models/afqRate");
const Agent = require('../models/agent');
const createHttpError = require("http-errors");
const calculatePallet = require("../utils/calculatePallet");


const calculateAmount = (rate, volume, unit) => {
    return (
        volume * rate.airFreightRate + 
        rate.airPortTransferFee + 
        rate.documentFee + 
        rate.billofLadingFee 
    ) * (1 + rate.chargeFee / 100) * unit
}

const afqRateUpdate = async (req, oldQuote) => {
    const {rate, unitType, pallets} = req.body;

    const {idChanged} = rate;

    let updateData = {};

    const afqRateData = await AFQRate.findOne({ _id: rate.id });

    if (!afqRateData) throw createHttpError(404, 'Rate not found');

    let volume, finalUnitType = unitType || oldQuote.unitType;

    if (pallets) {
        volume = calculatePallet(pallets, finalUnitType, 'afq');
    }
    else {
        volume = calculatePallet(oldQuote.pallets, finalUnitType, 'afq');
    }
    updateData.qubic = volume;

    if (idChanged) {
        updateData.exportAndFreight = {
            id: afqRateData.id,
            airFreightRate: afqRateData.airFreightRate,
            airPortTransferFee: afqRateData.airPortTransferFee,
            documentFee: afqRateData.documentFee,
            billofLadingFee: afqRateData.billofLadingFee,
            chargeFee: afqRateData.chargeFee,
            unit: rate.unit,
            amount: calculateAmount(afqRateData, volume, rate.unit) 
        }
    }
    else {
        updateData.exportAndFreight = {
            id: rate.id,
            airFreightRate: rate.airFreightRate,
            airPortTransferFee: rate.airPortTransferFee,
            documentFee: rate.documentFee,
            billofLadingFee: rate.billofLadingFee,
            chargeFee: rate.chargeFee,
            unit: rate.unit,
            amount: calculateAmount(rate, volume, rate.unit) 
        }
    }

    return updateData;
}


const afqQuote = async (req) => {
    const { 
        rateId, 
        pallets,
        unitType
    } = req.body;
    
    let exportAndFreight, customAduanaServices;
    const rate = await AFQRate.findOne({ _id: rateId });

    if (!rate) throw createHttpError(404, "Rate not found");

    const volume = calculatePallet(pallets, unitType, 'afq');

    exportAndFreight = {
        id: rate._id,
        airFreightRate: rate.airFreightRate,
        airPortTransferFee: rate.airPortTransferFee,
        documentFee: rate.documentFee,
        billofLadingFee: rate.billofLadingFee,
        chargeFee: rate.chargeFee,
        unit: 1,
        amount: calculateAmount(rate, volume, 1)
    };

    const agent = await Agent.findOne({ status: "Default" });

    if (agent) {
        customAduanaServices = {
            id: agent._id,
            classifyProduct: agent.classifyProduct,
            rojoSelective: agent.rojoSelective,
            review: agent.review,
            permitsCost: agent.permitsCost,
            unit: 1,
            amount: agent.classifyProduct,
        };
    }

    return { rate, exportAndFreight, customAduanaServices, volume }
}


module.exports = { afqQuote, afqRateUpdate };