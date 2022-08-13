const router = require('express').Router();
const Rate = require('../../models/rate');



router.get('/', async (req, res, next) => {
    try {
        const rate = await Rate.find({}, {exportLocation: 1, destinationCountry: 1});


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