const {Schema, model} = require('mongoose');

const OtherCostSchema = Schema({
    unit: {
        type: Number,
    },
	amount: {
        type: Number,
    },
	title: {
        type: String,
    },
	description: {
        type: String,
    }
})


const QuoteSchema = Schema({
    warehouse: {
        type: String,
        required: true
    },
    countryOfImport: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    numberOfPallets: {
        type: Number,
        required: true
    },
    typeOfMerchandise: {
        type: String,
        required: true
    },
    commercialInvoice: {
        type: String,
        required: true
    },
    statusOfShipment: {
        type: String,
        required: true
    },
    collectionTransport: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    pickupTransportation: {
        type: Object,
        default: {
            unit: 0,
            amount: 0
        }
    },
    exportAndFreight: {
        type: Object,
        default: {
            freightRate: 0,
            portFee: 0,
            documentFee: 0,
            billofLadingFee: 0,
            destinationBillofLadingFee: 0,
            chargeFee: 0,
            unit: 0,
            amount: 0
        }
    },
    ecommerceLogisticServices: {
        type: Object,
        default: {
            unit: 1,
            amount: 250
        }
    },
    customAduanaServices: {
        type: Object,
        default: {
            classifyProduct: 0,
            rojoSelective: 0,
            review: 0,
            permitsCost: 0,
            unit: 0,
            amount: 0
        }
    },
    deliveryToClient: {
        type: Object,
        default: {
            unit: 1,
            amount: 500
        }
    },
    otherCosts: {
        type: [OtherCostSchema]
    },
    tax: {
        type: Number,
        default: 7
    },
    confirmation: {
        type: String,
        default: `This is only a quote. Consolidatoin warehouse will measure and weight shipment and we'll provide you a final invoice. <br> This quote is only for shipping and customs services. You are responsible for taxes, and inspectons cost if goverment requires it.`
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


const Quote = model('quote', QuoteSchema);

module.exports = Quote;