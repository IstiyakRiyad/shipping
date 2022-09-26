const router = require('express').Router();
const Vehicle = require('../../models/vehicle');
const checkAuth = require('../authorization/checkAuth');



router.get('/', checkAuth(), async (req, res, next) => {
    try {

        const vehicles = await Vehicle.find({}, {companyName: 1, status: 1});


        res.json({
            message: 'All LCL Company Information',
            data: vehicles
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;