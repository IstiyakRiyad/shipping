const {Schema, model} = require('mongoose');

const QuoteSchema = Schema({
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
            unit: 0,
            amount: 0
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
            unit: 0,
            amount: 0
        }
    },
    otherCosts: {
        type: Array
    }
}, {timestamps: true});


const Quote = model('quote', QuoteSchema);

module.exports = Quote;