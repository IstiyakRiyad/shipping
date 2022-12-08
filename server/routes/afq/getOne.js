const router = require('express').Router();
const Afq = require('../../models/afq');
const {ObjectId} = require('mongoose').Types;
const checkAuth = require('../authorization/checkAuth');



router.get('/:afqId', checkAuth(), async (req, res, next) => {
    try {
        const {afqId} = req.params;


        const afq = await Afq.aggregate([
            {
                $match: {
                    _id: ObjectId(afqId)
                }
            },
            {
                $lookup: {
                    from: 'afqrates',
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


        // Rate info

        res.json({
            message: 'Afq Company Information',
            data: afq.length ? afq[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;