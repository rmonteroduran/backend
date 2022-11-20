const socket = io();

//productos

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {

    // armo el producto extrayendo los datos de los campos del formulario
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value,
    }

    // envio el producto al servidor via socket
    socket.emit('nuevoProducto', producto);
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