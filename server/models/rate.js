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
    consolidationAddress: {
        type: String
    },
    heatTreatPalletRequire: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {timestamps: true});


const Rate = model('rate', RateSchema);

module.exports = Rate;