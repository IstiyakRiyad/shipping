const router = require('express').Router();
const Quote = require('../../models/quote');
const checkAuth = require('../authorization/checkAuth');
// const {ObjectId} = require('mongoose').Types;



router.get('/:quoteId', checkAuth(), async (req, res, next) => {
    try {
        const {quoteId} = req.params;


        const quote = await Quote.findOne(
            {_id: quoteId},
            {
                __v: 0
            }
        );
        

        res.json({
            message: 'Quote Information',
            data: quote // quote.length ? quote[0] : null
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;