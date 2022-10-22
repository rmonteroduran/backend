const fs = require('fs')
const express = require('express')
const server = express()

async function read(name) {
    try {
        const result = JSON.parse(await fs.promises.readFile(`./${name}.txt`,'utf-8'))
        return result
    } catch (error) {
        return(`Archivo ${name} no encontrado`)
    }
}

class Contenedor {
    contentName
    
    constructor(name) {
        this.contentName = name
    }

    async getRandom() {
        let resultById
        await read(this.contentName).then(result => {
            if (result == `Archivo ${this.contentName} no encontrado`) {
                resultById = result
            } else {
                let a = result.find(el => el.id === 1)
                if (a) {
                    resultById = a
                } else {
                    resultById = 'Producto no encontrado'
                }
            }
        })
        return resultById
    }

    async getAll() {
        let resultAll
        await read(this.contentName).then(result => {
            resultAll = result
        })
        return resultAll
    }

}

server.get('/productos', async (peticion, respuesta) => {
    const contenedor =  new Contenedor('productos')
    respuesta.send(await contenedor.getAll()) 
})

server.get('/productoRandom', async (peticion, respuesta) => {
    const contenedor =  new Contenedor('productos')
    respuesta.send(await contenedor.getRandom()) 
})

function conectar(puerto) {
    return new Promise((resolve, reject) => {
        const servidorConectador = server.listen(puerto, () => {
            resolve(servidorConectador)
        })
        servidorConectador.on("error", error => reject(error))
    })
}

module.exports = { conectar }

