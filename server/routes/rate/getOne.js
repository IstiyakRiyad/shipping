const router = require('express').Router();
const Rate = require('../../models/rate');
const checkAuth = require('../authorization/checkAuth');



router.get('/:rateId',  checkAuth(), async (req, res, next) => {
    try {
        const {rateId} = req.params;

        const rate = await Rate.findOne({_id: rateId}, {__v: 0});


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