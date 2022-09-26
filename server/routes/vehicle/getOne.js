const router = require('express').Router();
const Vehicle = require('../../models/vehicle');
const {ObjectId} = require('mongoose').Types;
const checkAuth = require('../authorization/checkAuth');



router.get('/:vehicleId', checkAuth(), async (req, res, next) => {
    try {
        const {vehicleId} = req.params;


        const vehicle = await Vehicle.aggregate([
            {
                $match: {
                    _id: ObjectId(vehicleId)
                }
            },
            {
                $lookup: {
                    from: 'vehiclerates',
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
            message: 'Vehicle Company Information',
            data: vehicle.length ? vehicle[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;