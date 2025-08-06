let listaDeAmigos = [];
const LIMITE_AMIGOS = 10;

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