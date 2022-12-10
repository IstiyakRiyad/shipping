module.exports = (pallets, unitType = 'in', rateType) => {
    let volume = 0, totalWeight = 0;
    
    pallets.map(({unit, length, width, height, weight}) => {
        volume += width * height * length * unit / 1728 / 35.315;
        totalWeight += weight * unit;
    });

    if(rateType === 'afq' && unitType === 'in') {
        totalWeight *= 0.453592;
    }
    else if(unitType !== 'in') {
        totalWeight *= 0.453592;
    }

    // LCL
    if(rateType === 'afq' && (unitType !== 'in') && (volume / 5000.0) < totalWeight) {
        volume = totalWeight;
    }
    else if(rateType === 'afq' && (volume * 0.453592 / 166) < totalWeight) {
        volume = totalWeight;
    }
    if((rateType == 'china') && (totalWeight / 500 > volume)) {
        volume = totalWeight / 500;
    }
    
    if(volume < 1) volume = 1;

    return volume;
}