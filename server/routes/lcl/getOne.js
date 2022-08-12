const router = require('express').Router();
const Lcl = require('../../models/lcl');



router.get('/:lclId', async (req, res, next) => {
    try {
        const {lclId} = req.params;


        const lcl = await Lcl.findOne({_id: lclId}, {__v: 0});

        // Rate info

        res.json({
            message: 'LCL Company Information',
            data: lcl
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;