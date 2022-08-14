const router = require('express').Router();
const Quote = require('../../models/quote');
const checkAuth = require('../authorization/checkAuth');
const {ObjectId} = require('mongoose').Types;



router.get('/:quoteId', checkAuth(), async (req, res, next) => {
    try {
        const {quoteId} = req.params;


        const quote = await Quote.aggregate([
            {
                $match: {
                    _id: ObjectId(quoteId)
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'exportAndFreight.id',
                    foreignField: '_id',
                    as: 'exportAndFreight.data',
                    let: {
                        unit: '$exportAndFreight.unit',
                        amount: '$exportAndFreight.amount'
                    },
                    pipeline: [
                        {$project: {
                            _id: 0,
                            id: '$_id',
                            unit: '$$unit',
                            amount: '$$amount',
                            freightRate: 1,
                            portFee: 1,
                            documentFee: 1,
                            billofLadingFee: 1,
                            destinationBillofLadingFee: 1,
                            chargeFee: 1
                        }}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'agents',
                    localField: 'customAduanaServices.id',
                    foreignField: '_id',
                    as: 'customAduanaServices.data',
                    let: {
                        unit: '$customAduanaServices.unit',
                        amount: '$customAduanaServices.amount'
                    },
                    pipeline: [
                        {$project: {
                            _id: 0,
                            id: '$_id',
                            unit: '$$unit',
                            amount: '$$amount',
                            classifyProduct: 1,
                            rojoSelective: 1,
                            review: 1,
                            permitsCost: 1
                        }}
                    ]
                }
            }, 
            {
                $unwind: {
                    path: '$exportAndFreight.data'
                }
            },
            {
                $unwind: {
                    path: '$customAduanaServices.data'
                }
            },
            {
                $set: {
                    exportAndFreight: '$exportAndFreight.data',
                    customAduanaServices: '$customAduanaServices.data'
                }
            }
            
        ])
        
        

        res.json({
            message: 'Quote Information',
            data: quote
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;