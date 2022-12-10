const VehicleRate = require('../models/vehicleRate');
const createHttpError = require("http-errors");
const Agent = require("../models/agent");
const { saveImage } = require('../utils/storeImage');



const vehicleQuote = async (req) => {
    const { rateId } = req.body;

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


module.exports = {vehicleQuote};