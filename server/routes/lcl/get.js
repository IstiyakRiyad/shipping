const router = require('express').Router();
const Lcl = require('../../models/lcl');



router.get('/', async (req, res, next) => {
    try {

        const lcls = await Lcl.find({}, {__v: 0});


        res.json({
            message: 'All LCL Company Information',
            data: lcls
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;