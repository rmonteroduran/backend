const socket = io();

//productos

const botonEnviarProducto = document.getElementById('botonEnviarProducto')
botonEnviarProducto.addEventListener('click', e => {
    const inputNombre = document.getElementById('inputNombre')
    const inputPrecio = document.getElementById('inputPrecio')
    const inputImagen = document.getElementById('inputImagen')
    if (inputNombre.value && inputPrecio.value && inputImagen.value) {
        const producto = {
            title: inputNombre.value,
            price: inputPrecio.value,
            thumbnail: inputImagen.value,
        }
        socket.emit('nuevoProducto', producto)
        inputNombre.value = null
        inputPrecio.value = null
        inputImagen.value = null
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor ingrese nombre de producto, precio y url de imagen',
            customClass: {
                confirmButton: 'swalBtnColor'
            },
        })
    }
})

// agrego manejador de eventos de tipo 'productos'
socket.on('productosActualizados', manejarEventoProductos);

async function manejarEventoProductos(productos) {
    // busco la plantilla del servidor
    const recursoRemoto = await fetch('templates/lista.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con los productos recibidos
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('listaProductos').innerHTML = html
}

//mensajes

function mostrarMensajes(mensajes) {
    const mensajesParaMostrar = mensajes.map(({ fecha, autor, texto }) => {
        return `<div class="chat"><p>${fecha}</p><div class="msg"><h5>${autor}:</h5>&nbsp&nbsp<p>${texto}</p></div></div>`
    })

    const mensajesHtml = `
<div>
${mensajesParaMostrar.join('\n')}
</div>`

    const listaMensajes = document.getElementById('listaMensajes')
    listaMensajes.innerHTML = mensajesHtml

}

socket.on('mensajesActualizados', mensajes => {
    mostrarMensajes(mensajes)
})

const botonEnviar = document.getElementById('botonEnviar')
botonEnviar.addEventListener('click', e => {
    const inputAutor = document.getElementById('inputAutor')
    const inputMensaje = document.getElementById('inputMensaje')
    if (inputAutor.value && inputMensaje.value) {
        const mensaje = {
            autor: inputAutor.value,
            texto: inputMensaje.value
        }
        socket.emit('nuevoMensaje', mensaje)
        inputMensaje.value = null
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor ingrese su nombre y mensaje',
            customClass: {
                confirmButton: 'swalBtnColor'
            },
        })
    }
})