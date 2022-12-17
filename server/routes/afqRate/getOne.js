const router = require('express').Router();
const AfqRate = require('../../models/afqRate');
const checkAuth = require('../authorization/checkAuth');
const {ObjectId} = require('mongoose').Types;



router.get('/:afqRateId',  checkAuth(), async (req, res, next) => {
    try {
        const {afqRateId} = req.params;

        const afqrate = await AfqRate.aggregate([
            {
                $match: {_id: ObjectId(afqRateId)}
            },
            {
                $lookup: {
                    from: 'afqs',
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
            message: 'All AfqRate Company Information',
            data: afqrate.length ? afqrate[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;