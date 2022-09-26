const {Schema, model, Types} = require('mongoose');

const VehicleRateSchema = Schema({
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
    // 7 Vehecle Rates
    
    sedan: {
        type: Number,
        required: true
    }, 
    camionetas: {
        type: Number,
        required: true
    }, 
    medianos15: {
        type: Number,
        required: true
    }, 
    medianos16: {
        type: Number,
        required: true
    }, 
    grandes: {
        type: Number,
        required: true
    }, 
    extragrandes: {
        type: Number,
        required: true
    }, 
    motocicletas: {
        type: Number,
        required: true
    }, 
    carga: {
        type: Number
    },
    // end

    documentDeliveryFee: {
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
    note: {
        type: String,
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {timestamps: true});


const VehicleRate = model('vehicleRate', VehicleRateSchema);

module.exports = VehicleRate;