const AFQRate = require("../models/afqRate");
const Agent = require('../models/agent');
const createHttpError = require("http-errors");
const calculatePallet = require("../utils/calculatePallet");


const calculateAmount = (rate, volume, unit) => {
    return (
        volume * rate.airFreightRate + 
        rate.airPortTransferFee + 
        rate.documentFee + 
        rate.billofLadingFee +
        Math.max(rate.sedMinRate, rate.sed) +
        Math.max(rate.scrMinRate, volume * rate.scr) +
        Math.max(rate.peakSeasonSurchargesMinRate, volume * rate.peakSeasonSurcharges) +
        Math.max(rate.hdlgMinRate, volume * rate.hdlg) +
        Math.max(rate.hawbFeeMinRate,rate.hawbFee) +
        Math.max(rate.fuelMinRate, volume * rate.fuel) +
        Math.max(rate.cgMinRate, rate.cg) +
        Math.max(rate.airtransMinRate, volume * rate.airtrans) 
    ) * (1 + rate.chargeFee / 100) * unit
}



const exportAndFreightObj = (rate, volume, unit) => {
    return {
        id: rate._id ? rate._id : rate.id,
        airFreightRate: rate.airFreightRate,
        airPortTransferFee: rate.airPortTransferFee,
        documentFee: rate.documentFee,
        billofLadingFee: rate.billofLadingFee,
        chargeFee: rate.chargeFee,
        sed: rate.sed,
        scr: rate.scr,
        peakSeasonSurcharges: rate.peakSeasonSurcharges,
        hdlg: rate.hdlg,
        hawbFee: rate.hawbFee,
        fuel: rate.fuel,
        cg: rate.cg,
        airtrans: rate.airtrans,
        sedMinRate: rate.sedMinRate,
        scrMinRate: rate.scrMinRate,
        peakSeasonSurchargesMinRate: rate.peakSeasonSurchargesMinRate,
        hdlgMinRate: rate.hdlgMinRate,
        hawbFeeMinRate: rate.hawbFeeMinRate,
        fuelMinRate: rate.fuelMinRate,
        cgMinRate: rate.cgMinRate,
        airtransMinRate: rate.airtransMinRate,
        unit,
        amount: calculateAmount(rate, volume, unit)
    }
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

    // exportAndFreight rate
    if (idChanged) {
        updateData.exportAndFreight = exportAndFreightObj(afqRateData, volume, rate.unit);
    }
    else {
        updateData.exportAndFreight = exportAndFreightObj(rate, volume, rate.unit);
    }

    return updateData;
}


const afqQuote = async (req) => {
    const { 
        rateId, 
        pallets,
        unitType
    } = req.body;

    const rate = await AFQRate.findOne({ _id: rateId });

    if (!rate) throw createHttpError(404, "Rate not found");

    const volume = calculatePallet(pallets, unitType, 'afq');

    const exportAndFreight = exportAndFreightObj(rate, volume, 1);

    const agent = await Agent.findOne({ status: "Default" });
    
    let customAduanaServices;
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