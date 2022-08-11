const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    customAgentName: {
        type: String,
        required: true
    },
    customAgentAddress: {
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
    country: {
        type: String,
        required: true
    },
    classifyProduct: {
        type: String,
        required: true
    },
    rojoSelective: {
        type: String,
        required: true
    },
    rreview: {
        type: String,
        required: true
    },
    permitsCost: {
        type: String,
        required: true
    }
});


const User = model('agent', UserSchema);

module.exports = User;