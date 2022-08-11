const crypto = require('crypto');
const path = require('path');
const fs = require('fs');


const generateKey = () => {
    return crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',

        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    })
};


// Generate Refresh Token key
const tokenKey = generateKey();

fs.writeFileSync(path.resolve('secretKeys/tokenECPublic.pem'), tokenKey.publicKey, 'utf8');
fs.writeFileSync(path.resolve('secretKeys/tokenECPrivate.pem'), tokenKey.privateKey, 'utf8');


console.log('\x1b[32m%s\x1b[0m', `${tokenKey.publicKey}\n${tokenKey.privateKey}`);
