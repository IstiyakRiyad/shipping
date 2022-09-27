const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const multer = require('multer');


const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });


const saveImage = async (image) => {
    const {buffer} = image;

    const splitNames = image.originalname.split('.');
    const ext = splitNames[splitNames.length - 1];
    
    const imageName = `${Date.now()}${crypto.randomBytes(20).toString('hex')}.${ext}`;

    // Save the files
    await fs.writeFile(path.resolve(`data/image/${imageName}`), buffer);

    return imageName;
}


module.exports = {upload, saveImage};