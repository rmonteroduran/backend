import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from '../config/config.js'

function generarPassEncriptada(pass) {
    const passEncriptada = jwt.sign(pass, PRIVATE_KEY);
    return passEncriptada;
}

function generarPassOriginal(pass) {
    const passOriginal = jwt.verify(pass, PRIVATE_KEY)
    return passOriginal;
}

export {
    generarPassEncriptada,
    generarPassOriginal
}