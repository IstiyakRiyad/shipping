const Agent = require('../models/agent');

const agentUpdate = async (req, type) => {
    const {agent} = req.body;

    const {idChanged} = agent;

    const agentData = await Agent.findOne({_id: agent.id});

    let updateData = {};
    if(idChanged && agentData) {
        updateData.customAduanaServices = {
            id: agentData._id,
            vehicleRate: agentData.vehicleRate,
            classifyProduct: agentData.classifyProduct,
            rojoSelective: agentData.rojoSelective,
            review: agentData.review,
            permitsCost: agentData.permitsCost,
            unit: agent.unit,
            amount: (type == 'Vehicle') ? agentData.vehicleRate * agent.unit : agentData.classifyProduct * agent.unit,
        }
    }
    else if(agentData) {
        updateData.customAduanaServices = {
            id: agent._id,
            vehicleRate: agent.vehicleRate,
            classifyProduct: agent.classifyProduct,
            rojoSelective: agent.rojoSelective,
            review: agent.review,
            permitsCost: agent.permitsCost,
            id: agentData._id,
            unit: agent.unit,
            amount: (type == 'Vehicle')? agent.vehicleRate * agent.unit : agent.classifyProduct * agent.unit
        }
    }

    return updateData;
}

module.exports = {agentUpdate};