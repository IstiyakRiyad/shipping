const {Schema, model} = require('mongoose');

const LclSchema = Schema({
    companyName: {
        type: String,
        required: true
    },
    companyAddress: {
        type: String,
        required: true
    },
    salesEmail: {
        type: String,
        required: true
    },
    supportEmail: {
        type: String,
        required: true
    },
    enterPhoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {timestamps: true});


const Lcl = model('lcl', LclSchema);

module.exports = Lcl;