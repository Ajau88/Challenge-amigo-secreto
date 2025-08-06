// Se genera un estado centralizado y configuración
const config = {
    limite_amigos: 10,
    longitud_minima: 2
};

const estado = {
    listaDeAmigos: [],
    elementos: null
};

//Función de agregar amigo
function agregarAmigo() {
    const nombre = estado.elmentos.input.value.trim();

    //Validación de nombres
    const validacion = validarNombre(nombre);
    if (!validacion.valido) {
        mostrarMensaje(validacion.mensaje, 'error');
        estado.elmentos.input.focus();
        return;
    }

    //Agregar a la lista
    estado.listaDeAmigos.push(nombre);
    estado.elmentos.imput.value ='';

    //Actualiza interfaz
    mostarLista();
    actualizarDisponible();

    //Mostar mensaje de confirmación
    mostrarMensaje(`${nombre} Agregado correctamente`, 'success');
    //Mantener focus para contuar agregando
    estado.elmentos,input.focus();
}

//Validaciones y Utilidades

/**  Para validar los nombres ingresado
   @param {String} nombre 
   @return {Object}
   */
function validarNombre(nombre) {
    //verificamos si se encuentra vacio
    if (!nombre)  {
        return {
            valido: false,
            mensaje: "Ingresa un nombre, por favor." 
        };
    }

    // verificamos que tenga un tamaño de por lo menos 2 caracteres
    if (nombre.length < config.longitud_minima) {
        return {
            valido: false,
            mensaje: `El nombre debe tener por lo menos ${config.longitud_minima} caracteres.`
        };
    }

    //Verificar que solo tenga letras
    const soloLetras = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/;
    if (!soloLetras.test(nombre)) {
        return {
            valido: false,
            mensaje: "Solo es permitido el ingreso de letras y espacios (sin números ni símbolos)."
        };
    }

    //Verificar limite de ingresos de amigos
    if (estado.listaDeAmigos.length >= config.limite_amigos) {
        return {
            valido: false,
            mensaje: `Ya has ingresado el máximo de  ${config.limite_amigos}amigos.`
        };   
    }

    //Verificar nombres duplicados (sean en mayúscula o minúscula)
    const nombreExistente = buscarDuplicado(nombre);
    if (nombreExistente) {
        return {
            valido: false,
            mensaje: `Este nombre ya existe como "${nombreExistente}". Recuerda no repetir los nombres.`,
            nombreExistente: nombreExistente
        };
    }

}  

