const fs = require('fs')
const { randomUUID } = require('crypto')

class Contenedor {
    #elementos

    constructor() {
        this.#elementos = []
    }

    guardar(elemento) {
        this.#elementos.push(elemento)
    }

    recuperarTodos() {
        return this.#elementos
    }

}

class ContenedorArchivo {
    #elementos
    #ruta

    constructor(ruta) {
        this.#ruta = ruta
        this.#elementos = []
    }

    async guardar(elemento) {
        this.#elementos.push(elemento)
        await fs.promises.writeFile(this.#ruta, JSON.stringify(this.#elementos))
    }

    async recuperarTodos() {
        this.#elementos = JSON.parse(await fs.promises.readFile(this.#ruta,'utf-8'))
        return this.#elementos
    }

}

function test() {
    const contenedor = new Contenedor()

    contenedor.guardar({
        id: randomUUID(),
        nombre: 'bla bla'
    })

    contenedor.guardar({
        id: randomUUID(),
        nombre: 'bla2 bla2'
    })

    console.log(contenedor.recuperarTodos())
}

async function test2() {
    const rutaArchivo = './elementos.txt'
    await fs.promises.writeFile(rutaArchivo, '[]')
    const contenedor = new ContenedorArchivo(rutaArchivo)

    await contenedor.guardar({
        id: randomUUID(),
        nombre: 'bla bla'
    })

    await contenedor.guardar({
        id: randomUUID(),
        nombre: 'bla2 bla2'
    })

    console.log(await contenedor.recuperarTodos())
}

test()
test2()