const AFQRate = require("../models/afqRate");
const createHttpError = require("http-errors");
const calculatePallet = require("../utils/calculatePallet");




const afqQuote = async (req) => {
    const { rateId } = req.body;
    let exportAndFreight;
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
        amount:
            (volume * rate.airFreightRate +
                rate.airPortTransferFee +
                rate.documentFee +
                rate.billofLadingFee) *
            (1 + rate.chargeFee / 100),
    };

    return { rate, exportAndFreight, volume }
}


module.exports = { afqQuote };