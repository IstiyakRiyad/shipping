module.exports = (pallets, unitType) => {
    let volume = 0, totalWeight = 0;
    
    pallets.map(({unit, length, width, height, weight}) => {
        volume += width * height * length * unit / 1728 / 35.315;
        totalWeight += weight;
    });

    if(volume < 1) volume = 1;
    if(unitType = 'inch') {
        totalWeight *= 0.453592;
    }

    if(totalWeight / 500 > volume) {
        volume = totalWeight;
    }
     
    return volume;
}