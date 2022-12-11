const Rate = require("../models/rate");
const createHttpError = require("http-errors");
const Agent = require("../models/agent");
const calculatePallet = require("../utils/calculatePallet");

const calculateGlobalAmount = (rate, volume, unit) => {
    return (
        volume * rate.freightRate + 
        volume * rate.portFee + 
        rate.documentFee + 
        rate.billofLadingFee + 
        rate.destinationBillofLadingFee
    ) * (1 + rate.chargeFee / 100) * unit
}

const calculateChinaAmount = (rate, volume, unit) => {
    return (
        rate.documentFeeChina +
        rate.clearanceFeeChina +
        rate.vgmFeeChina +
        rate.mainfestFeeChina +
        volume * rate.cfsFeeChina +
        volume * rate.ocFeeChina +
        (volume * rate.oceanFreightFeeChina +
            rate.destinationBillOfLadingFeeChina) * (1 + rate.collectFeeChina / 100)
    ) * unit
}




const lclRateUpdate = async (req, oldQuote) => {
    const {rate, unitType, pallets} = req.body;

    const {idChanged} = rate;

    let updateData = {};

    const rateData = await Rate.findOne({ _id: rate.id });

    if (!rateData) throw createHttpError(404, 'Rate not found');

    let volume, finalUnitType = unitType || oldQuote.unitType;

    if (pallets) {
        volume = calculatePallet(pallets, finalUnitType, rateData.rateType);
    }
    else {
        volume = calculatePallet(oldQuote.pallets, finalUnitType, rateData.rateType);
    }
    updateData.qubic = volume;

    if (idChanged) {
        if (rateData.rateType === 'global') {
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
                amount: calculateGlobalAmount(rateData, volume, rate.unit)
            }
        }
        else if (rateData.rateType === 'china') {
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
                amount: calculateChinaAmount(rateData, volume, rate.unit)
            }
        }

    }
    else {
        if (rateData.rateType === 'global') {
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
                amount: calculateGlobalAmount(rate, volume, rate.unit)
            }
        }
        else if (rateData.rateType === 'china') {
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
                amount: calculateChinaAmount(rate, volume, rate.unit)
            }
        }

    }
    updateData.warehouse = rateData.warehouse;
    updateData.countryOfImport = rateData.countryOfImport;
    updateData.consolidationAddress = rateData.consolidationAddress;
    updateData.heatTreatPalletRequire = rateData.heatTreatPalletRequire;

    return updateData;
}



const lclQuote = async (req) => {
    const {
        rateId,
        pallets,
        unitType
    } = req.body;

    let exportAndFreight, customAduanaServices;
    const rate = await Rate.findOne({ _id: rateId });

    if (!rate) throw createHttpError(404, "Rate not found");

    const volume = calculatePallet(pallets, unitType, rate.rateType);

    if (rate.rateType == 'global') {
        exportAndFreight = {
            id: rate._id,
            rateType: rate.rateType,
            freightRate: rate.freightRate,
            portFee: rate.portFee,
            documentFee: rate.documentFee,
            billofLadingFee: rate.billofLadingFee,
            destinationBillofLadingFee: rate.destinationBillofLadingFee,
            chargeFee: rate.chargeFee,
            unit: 1,
            amount: calculateGlobalAmount(rate, volume, 1)
        };
    }
    else if (rate.rateType == 'china') {
        exportAndFreight = {
            id: rate._id,
            rateType: rate.rateType,
            documentFeeChina: rate.documentFeeChina,
            clearanceFeeChina: rate.clearanceFeeChina,
            vgmFeeChina: rate.vgmFeeChina,
            mainfestFeeChina: rate.mainfestFeeChina,
            cfsFeeChina: rate.cfsFeeChina,
            ocFeeChina: rate.ocFeeChina,
            oceanFreightFeeChina: rate.oceanFreightFeeChina,
            destinationBillOfLadingFeeChina: rate.destinationBillOfLadingFeeChina,
            collectFeeChina: rate.collectFeeChina,
            unit: 1,
            amount:calculateChinaAmount(rate, volume, 1)
        };


    }


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


module.exports = { lclQuote, lclRateUpdate };