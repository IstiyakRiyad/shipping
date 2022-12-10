const Rate = require("../models/rate");
const createHttpError = require("http-errors");
const Agent = require("../models/agent");
const calculatePallet = require("../utils/calculatePallet");




const lclQuote = async (req) => {
    const { rateId } = req.body;
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
            amount:
                (volume * rate.freightRate +
                    volume * rate.portFee +
                    rate.documentFee +
                    rate.billofLadingFee +
                    rate.destinationBillofLadingFee) *
                (1 + rate.chargeFee / 100),
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
            amount:
                (
                    rate.documentFeeChina +
                    rate.clearanceFeeChina +
                    rate.vgmFeeChina +
                    rate.mainfestFeeChina +
                    volume * rate.cfsFeeChina +
                    volume * rate.ocFeeChina +
                    (volume * rate.oceanFreightFeeChina +
                        rate.destinationBillOfLadingFeeChina) * (1 + rate.collectFeeChina / 100)
                ),
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

    return {rate, exportAndFreight, customAduanaServices, volume}
}


module.exports = {lclQuote};