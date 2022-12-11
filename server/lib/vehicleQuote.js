const VehicleRate = require('../models/vehicleRate');
const createHttpError = require("http-errors");
const Agent = require("../models/agent");
const { saveImage } = require('../utils/storeImage');


const vehicleRateUpdate = async (req) => {
    const {rate, vehicleSize} = req.body;

    const {idChanged} = rate;

    let updateData = {};

    const rateData = await VehicleRate.findOne({_id: rate.id});

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

    return updateData;
}


const vehicleQuote = async (req) => {
    const { rateId, vehicleSize } = req.body;

    let image, customAduanaServices;
    let rate = await VehicleRate.findOne({ _id: rateId });

    if (!rate) throw createHttpError(404, "Rate not found");

    if (req.file) {
        image = await saveImage(req.file);
    }

    let exportAndFreight = {
        id: rate._id,
        vehicleSize: rate[vehicleSize],
        documentDeliveryFee: rate.documentDeliveryFee,
        documentFee: rate.documentFee,
        billofLadingFee: rate.billofLadingFee,
        destinationBillofLadingFee: rate.destinationBillofLadingFee,
        chargeFee: rate.chargeFee,
        unit: 1,
        amount:
            (rate[vehicleSize] +
                rate.documentDeliveryFee +
                rate.documentFee +
                rate.billofLadingFee +
                rate.destinationBillofLadingFee) *
            (1 + rate.chargeFee / 100),
    };

    const agent = await Agent.findOne({ status: "Default" });

    if (agent) {
        customAduanaServices = {
            id: agent._id,
            vehicleRate: agent.vehicleRate,
            classifyProduct: agent.classifyProduct,
            rojoSelective: agent.rojoSelective,
            review: agent.review,
            permitsCost: agent.permitsCost,
            unit: 1,
            amount: agent.vehicleRate,
        };
    }

    return { rate, image, customAduanaServices, exportAndFreight }
}


module.exports = {vehicleQuote, vehicleRateUpdate};