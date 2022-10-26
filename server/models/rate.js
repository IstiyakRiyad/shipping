const {Schema, model, Types} = require('mongoose');

const RateSchema = Schema({
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
    freightRate: {
        type: Number
    },
    portFee: {
        type: Number
    },
    documentFee: {
        type: Number
    },
    billofLadingFee: {
        type: Number
    },
    destinationBillofLadingFee: {
        type: Number
    },
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

    // New
    documentFeeChina: {
        type: Number
    },
    clearanceFeeChina: {
        type: Number
    },
    vgmFeeChina: {
        type: Number
    },
    mainfestFeeChina: {
        type: Number
    },
    cfsFeeChina: {
        type: Number
    },
    ocFeeChina: {
        type: Number
    },
    oceanFreightFeeChina: {
        type: Number
    },
    destinationBillOfLadingFeeChina: {
        type: Number
    },
    collectFeeChina: {
        type: Number
    },
    status: {
        type: String,
        default: 'Pending'
    },
    rateType: {
        type: String,
        default: "global"
    }
}, {timestamps: true});


const Rate = model('rate', RateSchema);

module.exports = Rate;