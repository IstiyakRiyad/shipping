const {Schema, model} = require('mongoose');

const UserSchema = Schema({
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
    }
});


const User = model('lcl', UserSchema);

module.exports = User;