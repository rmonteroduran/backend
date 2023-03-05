import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from '../config/config.js'

function passEncryptor(pass) {
    const passEncrypted = jwt.sign(pass, PRIVATE_KEY);
    return passEncrypted;
}

function passDecryptor(pass) {
    const passDecrypted = jwt.verify(pass, PRIVATE_KEY)
    return passDecrypted;
}

export {
    passEncryptor,
    passDecryptor
}