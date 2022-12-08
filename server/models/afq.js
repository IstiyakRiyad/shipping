const {Schema, model} = require('mongoose');

const AFQSchema = Schema({
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
    note: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {timestamps: true});


const AFQ = model('afq', AFQSchema);

module.exports = AFQ;