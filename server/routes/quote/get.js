const router = require('express').Router();
const Quote = require('../../models/quote');
const checkAuth = require('../authorization/checkAuth');



router.get('/', checkAuth(), async (req, res, next) => {
    try {
        const {filter, search_query} = req.query;

        let subQueries = [/.*/];
        if(search_query) {
            subQueries = search_query.match(/\b(\w+)\b/g).map(search => new RegExp(`${search}`, 'i'));
        }

        let query;
        if(filter) {
            query = {status: filter, name: {$in: subQueries}}
        }
        else {
            query = {name: {$in: subQueries}}
        }

        const quote = await Quote.find(
            query, 
            {
                type: 1,
                name: 1, 
                email: 1,
                phone: 1,
                // FCL
                origin: 1,
                destination: 1,
                
                warehouse: 1, 
                countryOfImport: 1,
                status: 1,
                pallets: 1,
                unitType: 1,
                qubic: 1,
                statusOfShipment: 1,
                vehicleSize: 1
            }
        );

        res.json({
            message: 'All Quote Information',
            data: quote
        });
    }
    catch(error) {
        next(error);
    }
});



module.exports = router;