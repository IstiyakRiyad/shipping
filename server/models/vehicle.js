const {Schema, model} = require('mongoose');

const VehicleSchema = Schema({
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


const Vehicle = model('vehicle', VehicleSchema);

module.exports = Vehicle;