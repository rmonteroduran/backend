import express from 'express';
import { controllerLogin, controllerLogout } from '../controllers/controllerUsers.js';
import passport from 'passport'

const routerLogin = express.Router()

routerLogin.post('/login', passport.authenticate('login', { failWithError: true }), controllerLogin)
routerLogin.post('/logout', controllerLogout)

export default routerLogin