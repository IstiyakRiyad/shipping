const router = require('express').Router();
const Lcl = require('../../models/lcl');
const {ObjectId} = require('mongoose').Types;
const checkAuth = require('../authorization/checkAuth');



router.get('/:lclId', checkAuth(), async (req, res, next) => {
    try {
        const {lclId} = req.params;


        const lcl = await Lcl.aggregate([
            {
                $match: {
                    _id: ObjectId(lclId)
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


        // Rate info

        res.json({
            message: 'LCL Company Information',
            data: lcl.length ? lcl[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;