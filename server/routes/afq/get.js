const router = require('express').Router();
const Afq = require('../../models/afq');
const checkAuth = require('../authorization/checkAuth');



router.get('/', checkAuth(), async (req, res, next) => {
    try {

        const afqs = await Afq.find({}, {companyName: 1, status: 1});


        res.json({
            message: 'All Afq Company Information',
            data: afqs
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;