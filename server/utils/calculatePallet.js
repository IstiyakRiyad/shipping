module.exports = (pallets, unitType, rateType) => {
    let volume = 0, totalWeight = 0;
    
    pallets.map(({unit, length, width, height, weight}) => {
        volume += width * height * length * unit / 1728 / 35.315;
        totalWeight += weight * unit;
    });

    if(unitType == 'inch') {
        totalWeight *= 0.453592;
    }

    if((rateType == 'china') && (totalWeight / 500 > volume)) {
        volume = totalWeight / 500;
    }
    
    if(volume < 1) volume = 1;

    return volume;
}