const router = require('express').Router();
const Agent = require('../../models/agent');
const {ObjectId} = require('mongoose').Types;
const checkAuth = require('../authorization/checkAuth');



router.get('/:agentId', checkAuth(), async (req, res, next) => {
    try {
        const {agentId} = req.params;

        const agent = await Agent.aggregate([
            {
                $match: {
                    _id: ObjectId(agentId)
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: '_id',
                    foreignField: 'partnerId',
                    as: 'rates',
                    pipeline: [
                        {
                            $project: {
                                exportLocation: 1,
                                destinationCountry: 1,
                                status: 1,
                                updatedAt: 1,
                                note: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ]);


        res.json({
            message: 'One Agent Company Information',
            data: agent.length ? agent[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;