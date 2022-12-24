const socket = io();

//productos

const botonEnviarProducto = document.getElementById('botonEnviarProducto')
botonEnviarProducto.addEventListener('click', e => {
    const inputTitulo = document.getElementById('inputTitulo')
    const inputPrecio = document.getElementById('inputPrecio')
    const inputImagen = document.getElementById('inputImagen')
    if (inputNombre.value && inputPrecio.value && inputImagen.value) {
        const producto = {
            title: inputTitulo.value,
            price: inputPrecio.value,
            thumbnail: inputImagen.value,
        }
        socket.emit('nuevoProducto', producto)
        inputTitulo.value = null
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

function mostrarMensajes(mensajes, compresion) {
    var data = []
    data.push(...mensajes)
    const mensajesParaMostrar = data.map(({ fecha, autor, texto }) => {
        return `<div class="chat"><p>${fecha}</p></p><div class="msg"><h5>${autor.alias}:</h5>&nbsp&nbsp<p>${texto}</p></div></div>`
    })

    const mensajesHtml = `
<div>
<p>compresión: ${compresion}%</p>
${mensajesParaMostrar.join('\n')}
</div>`

    const listaMensajes = document.getElementById('listaMensajes')
    listaMensajes.innerHTML = mensajesHtml

}

socket.on('mensajesActualizados', mensajes => {
    const autorSchema = new normalizr.schema.Entity('autores', {}, {idAttribute: 'email' });
    const mensajeSchema = new normalizr.schema.Entity('mensajes', {
        autor: autorSchema,
    });
    const comentariosSchema = new normalizr.schema.Array(mensajeSchema)
    const denormalizeMensajes = normalizr.denormalize(mensajes.result, comentariosSchema, mensajes.entities);

    const longN = JSON.stringify(mensajes).length
    //console.log('Longitud objeto normalizado: ', longN)
    const longD = JSON.stringify(denormalizeMensajes).length
    //console.log('Longitud objeto desnormalizado: ', longD)
    const porcentajeC = (longN * 100) / longD
    //console.log('Porcentaje de compresión: ', porcentajeC.toFixed(2) + '%')
    
    mostrarMensajes(denormalizeMensajes, porcentajeC.toFixed(2))
})

const botonEnviar = document.getElementById('botonEnviar')
botonEnviar.addEventListener('click', e => {
    const inputEmail = document.getElementById('inputEmail')
    const inputNombre = document.getElementById('inputNombre')
    const inputApellido = document.getElementById('inputApellido')
    const inputEdad = document.getElementById('inputEdad')
    const inputAlias = document.getElementById('inputAlias')
    const inputAvatar = document.getElementById('inputAvatar')
    const inputMensaje = document.getElementById('inputMensaje')
    if (inputEmail.value && inputMensaje.value && inputNombre.value && inputApellido.value && inputEdad.value && inputAlias.value && inputAvatar.value) {
        const mensaje = {
            autor: {
                email: inputEmail.value,
                nombre: inputNombre.value,
                apellido: inputApellido.value,
                edad: inputEdad.value,
                alias: inputAlias.value,
                avatar: inputAvatar.value,
            },
            texto: inputMensaje.value
        }
        socket.emit('nuevoMensaje', mensaje)
        inputEmail.value = null
        inputNombre.value = null
        inputApellido.value = null
        inputEdad.value = null
        inputAlias.value = null
        inputAvatar.value = null
        inputMensaje.value = null
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor ingrese todos los campos',
            customClass: {
                confirmButton: 'swalBtnColor'
            },
        })
    }
})