const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');


const publicKey = fs.readFileSync(path.resolve('secretKeys/tokenECPublic.pem'), 'utf8');
const privateKey = fs.readFileSync(path.resolve('secretKeys/tokenECPrivate.pem'), 'utf8');


// Make a token
const signToken = (payload) => {
    // Return Promise
    return new Promise((resolve, reject) => {
        // Sign the payload with json web token
        jwt.sign(payload, privateKey, { algorithm: 'ES256' }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
}

// Verify Token
const verifyToken = (token) => {
    // Return Promise
    return new Promise((resolve, reject) => {
        // Verify json web token
        jwt.verify(token, publicKey, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
}

module.exports = {signToken, verifyToken};