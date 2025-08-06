// Se genera un estado centralizado y configuración
const config = {
    limite_amigos: 10,
    longitud_minima: 2
};

const estado = {
    listaDeAmigos: [],
    elementos: null
};

//Inicia referencias del DOM
function inicializarElementos() {
    estado.elementos = {
        input: document.getElementById('amigo'),
        listaDeAmigos: document.getElementById('listaDeAmigos'),
        disponibles: document.getElementById('disponibles')
    };
}

//Función de agregar amigo
function agregarAmigo() {
    const nombre = estado.elementos.input.value.trim();

    //Validación de nombres
    const validacion = validarNombre(nombre);
    if (!validacion.valido) {
        mostrarMensaje(validacion.mensaje, 'error');
        estado.elementos.input.focus();
        return;
    }

    //Agregar a la lista
    estado.listaDeAmigos.push(nombre);
    estado.elementos.input.value ='';

    //Actualiza interfaz
    mostrarLista();
    actualizarDisponibles();

    //Mostrar mensaje de confirmación
    mostrarMensaje(`${nombre} Agregado correctamente`, 'success');
    //Mantener focus para contuar agregando
    estado.elementos.input.focus();
}

//Función mostrar lista de amigos
function mostrarLista() {
    const ul= estado.elementos.listaDeAmigos;
    ul.innerHTML ='';
    if (estado.listaDeAmigos.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay amigos agregados aún.';
        ul.appendChild(li);
        return;
    }

    estado.listaDeAmigos.forEach((amigo, indice) => {
        const li = document.createElement('li');

        //Nombre de amigo
        const spanNombre = document.createElement('span');
        spanNombre.textContent = amigo;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'x';
        btnEliminar.onclick = () => eliminarAmigo(indice);
        
        li.appendChild(spanNombre);
        li.appendChild(btnEliminar);
        ul.appendChild(li);
    });
}

//Validaciones y Utilidades


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

    return {valido: true, mensaje: ''};
}  

//Buscar si existen nombres duplicado
function buscarDuplicado(nombre) {
    const nombreNormalizado = normalizarNombre(nombre);

    return estado.listaDeAmigos.find(amigo => normalizarNombre (amigo) === nombreNormalizado) || null;
}

//Normalizar nombre para compararlo
function normalizarNombre(nombre) {
    return nombre
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

//Eliminar amigo de la lista
function eliminarAmigo(indice) {
    const nombreEliminado = estado.listaDeAmigos[indice];
    estado.listaDeAmigos.splice(indice, 1);

    mostrarLista();
    actualizarDisponibles();
    mostrarMensaje(`${nombreEliminado} eliminado de la lista`, 'info');
}

//Actualizar contador de lugares disponibles
function actualizarDisponibles() {
    if (!estado.elementos.disponibles) return;
    const disponibles = config.limite_amigos - estado.listaDeAmigos.length;
    const plural = disponibles === 1 ? 'puesto' : 'puestos';

    estado.elementos.disponibles.textContent = `Quedan ${disponibles} ${plural} disponibles.`;
}