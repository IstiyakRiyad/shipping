const router = require('express').Router();
const Rate = require('../../models/rate');



router.get('/', async (req, res, next) => {
    try {
        const rate = await Rate.aggregate([
            {
                $match: {}
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
                    partner: 1,
                    exportLocation: 1, 
                    destinationCountry: 1
                }
            }
        ])
        
        
        
        // find({}, {exportLocation: 1, destinationCountry: 1});


        res.json({
            message: 'All Rate Company Information',
            data: rate
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;