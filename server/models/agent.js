const {Schema, model} = require('mongoose');

const AgentSchema = Schema({
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
        type: Number,
        required: true
    },
    rojoSelective: {
        type: Number,
        required: true
    },
    review: {
        type: Number,
        required: true
    },
    permitsCost: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    status: {
        type: String,
        default: 'Active'
    }
}, {timestamps: true});


const Agent = model('agent', AgentSchema);

module.exports = Agent;