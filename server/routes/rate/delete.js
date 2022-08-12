const router = require('express').Router();


router.post('/', async (req, res, next) => {
    try {

        res.json({
            message: 'Logout successfully'
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;