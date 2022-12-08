const router = require('express').Router();
const AfqRate = require('../../models/afqRate');



router.get('/', async (req, res, next) => {
    try {
        const afqrate = await AfqRate.aggregate([
            {
                $match: {}
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
                    partner: 1,
                    exportLocation: 1, 
                    destinationCountry: 1,
                    status: 1
                }
            }
        ])
        
        
        
        // find({}, {exportLocation: 1, destinationCountry: 1});


        res.json({
            message: 'All AfqRate Company Information',
            data: afqrate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;