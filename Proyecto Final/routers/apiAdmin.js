import express from 'express';
import {controllerPostLogin,
    controllerPostLogout} from '../controllers/controllerAdmin.js';
    
const routerApiAdmin = express.Router()

routerApiAdmin.post('/login', controllerPostLogin)
routerApiAdmin.post('/logout', controllerPostLogout)

export default routerApiAdmin