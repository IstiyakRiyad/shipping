module.exports = (pallets) => {
    let volume = 0;

    pallets.map(({unit, length, width, height}) => {
        volume += width * height * length * unit / 1728 / 35.315;
    });

    if(volume < 1) volume = 1;
     
    return volume;
}