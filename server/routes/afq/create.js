const router = require('express').Router();
const Afq = require('../../models/afq');
const checkAuth = require('../authorization/checkAuth');



router.post('/', checkAuth(), async (req, res, next) => {
    try {
        const {
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber,
            note
        } = req.body;
        
        const afq = await new Afq({
            companyName,
            companyAddress,
            salesEmail,
            supportEmail,
            enterPhoneNumber,
            note
        }).save();


        res.json({
            message: 'AFQ Company Information',
            data: afq
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;