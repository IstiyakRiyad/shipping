const router = require('express').Router();
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');
const {ObjectId} = require('mongoose').Types;



router.get('/:rateId',  checkAuth(), async (req, res, next) => {
    try {
        const {rateId} = req.params;

        const rate = await Rate.aggregate([
            {
                $match: {_id: ObjectId(rateId)}
            },
            {
                $lookup: {
                    from: 'lcls',
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
            message: 'All Rate Company Information',
            data: rate.length ? rate[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;