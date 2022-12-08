const {Schema, model, Types} = require('mongoose');

const AFQRateSchema = Schema({
    partnerId: {
        type: Types.ObjectId,
        required: true
    },
    exportLocation: {
        type: String,
        required: true
    },
    destinationCountry: {
        type: String,
        required: true
    },
    airFreightRate: {
        type: Number
    },
    airPortTransferFee: {
        type: Number
    },
    documentFee: {
        type: Number
    },
    billofLadingFee: {
        type: Number
    },
    // destinationBillofLadingFee: {
    //     type: Number
    // },
    chargeFee: {
        type: Number,
        default: 0
    },
    consolidationAddress: {
        type: String
    },
    heatTreatPalletRequire: {
        type: String
    },
    note: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active Rate'
    }
}, {timestamps: true});


const AFQRate = model('afqrate', AFQRateSchema);

module.exports = AFQRate;