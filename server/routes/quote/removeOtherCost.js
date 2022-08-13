const router = require('express').Router();
const Quote = require('../../models/quote');
const checkAuth = require('../authorization/checkAuth');


router.patch('/:quoteId', checkAuth(), async (req, res, next) => {
    try {
        const {quoteId} = req.params;

        const { otherId } = req.body;
        
        

        const quote = await Quote.findOneAndUpdate({_id: quoteId}, {$pull: {otherCosts: {_id: otherId}}}, {new: true});

        res.json({
            message: 'Quote Informatio',
            data: quote
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;