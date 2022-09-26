const router = require('express').Router();
const VehicleRate = require('../../models/vehicleRate');
const checkAuth = require('../authorization/checkAuth');
const {ObjectId} = require('mongoose').Types;



router.get('/:rateId',  checkAuth(), async (req, res, next) => {
    try {
        const {rateId} = req.params;

        const rate = await VehicleRate.aggregate([
            {
                $match: {_id: ObjectId(rateId)}
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'partnerId',
                    foreignField: '_id',
                    as: 'partner',
                    pipeline: [
                        {$project: {
                            companyName: 1
                        }}
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
            message: 'All Vehicle Rate Company Information',
            data: rate.length ? rate[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;