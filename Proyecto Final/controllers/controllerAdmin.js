import { read, update } from '../containers/containerMemoria.js'

async function adminCheck(req, res, next) {
    await read('users')
    .then(result => {
        if (result.admin == true) {
            next()
        } else {
            res.sendStatus(403)
        }
    })
    .catch(err => {
        res.status(500)
        res.json(err)
    })
}

async function controllerPostLogin(req, res) {
    const status = {admin: true}
    await update('users', status)
    .then(result => {
        res.status(200)
        res.json(status)
    })
    .catch(err => {
        res.status(500)
        res.json(err)
    })
}

async function controllerPostLogout(req, res) {
    const status = {admin: false}
    await update('users', status)
    .then(result => {
        res.status(200)
        res.json(status)
    })
    .catch(err => {
        res.status(500)
        res.json(err)
    })
}

export { controllerPostLogin,
    controllerPostLogout, adminCheck }
