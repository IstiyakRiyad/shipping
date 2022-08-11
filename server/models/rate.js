const {Schema, model} = require('mongoose');

const RateSchema = Schema({
    exportLocation: {
        type: String,
        required: true
    },
    destinationCountry: {
        type: String,
        required: true
    },
    freightRate: {
        type: Number,
        required: true
    },
    portFee: {
        type: Number,
        required: true
    },
    documentFee: {
        type: Number,
        required: true
    },
    billofLadingFee: {
        type: Number,
        required: true
    },
    destinationBillofLadingFee: {
        type: Number,
        required: true
    },
    chargeFee: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true
    },
    consolidationAddress: {
        type: String
    },
    heatTreatPalletRequire: {
        type: String
    }
});


const Rate = model('rate', RateSchema);

module.exports = Rate;