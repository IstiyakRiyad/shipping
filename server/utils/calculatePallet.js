const calculatePallet = (pallets, unitType = 'in', rateType) => {
    let volume = 0, totalWeight = 0;
    
    // LCL & AFQ
    let converts = 1728 * 35.315;
    if(rateType == 'afq') converts = 1;

    pallets.map(({unit, length, width, height, weight}) => {
        volume += width * height * length * unit / converts;
        totalWeight += weight * unit;
    });

    if(rateType === 'afq' && unitType === 'in') {
        totalWeight *= 0.453592;
    }
    else if(rateType !== 'afq' && unitType !== 'in') {
        totalWeight *= 0.453592;
    }

    // LCL
    if(rateType === 'afq' && (unitType !== 'in')) {
        if((volume / 5000.0) < totalWeight) volume = totalWeight;
        else volume = (volume / 5000.0);
    }
    else if(rateType === 'afq') {
        if((volume * 0.453592 / 166) < totalWeight) volume = totalWeight;
        else volume = (volume * 0.453592 / 166);
    }
    if((rateType == 'china') && (totalWeight / 500 > volume)) {
        volume = totalWeight / 500;
    }
    
    if(volume < 1) volume = 1;

    return Math.round(volume);
}

module.exports = calculatePallet;

// console.log(calculatePallet( [
//     {
//         "unit": 1,
//         "length": 76,
//         "width": 63,
//         "height": 50,
//         "weight": 68,
//         "_id": "6394b9207d72246af5046f31"
//     }
// ], 'cm', 'afq'))

