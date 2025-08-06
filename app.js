// Se genera un estado centralizado y configuración
const config = {
    limite_amigos: 10,
    longitud_minima: 2
};

const estado = {
    listaDeAmigos: [],
    amigosSorteados: [],
    elementos: null
};

//Inicia referencias del DOM
function inicializarElementos() {
    estado.elementos = {
        input: document.getElementById('amigo'),
        listaDeAmigos: document.getElementById('listaAmigos'),
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
        btnEliminar.textContent = 'eliminar';
        btnEliminar.onclick = () => eliminarAmigo(indice);
        
        // Estilo para botón pequeño y discreto
        btnEliminar.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
        `;
        btnEliminar.title = 'Eliminar';
        
        // Contenedor con flexbox para alinear nombre y botón
        li.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
        `;
        
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

function sortearAmigo() {
    // Valida que haya al menos 2 amigos
    if (estado.listaDeAmigos.length < 2) {
        mostrarMensaje('Necesitas al menos 2 amigos para hacer el sorteo', 'error');
        return;
    }

    //Amigos no sorteados aún
    const amigosDisponibles = estado.listaDeAmigos.filter(amigo => !estado.amigosSorteados.includes(amigo));

    //Verificar si aún hay amigos disponibles
    if (amigosDisponibles.length === 0) {
        mostrarMensaje('¡Ya se sortearon todos los amigos! Reinicia para empezar de nuevo', 'info');
        mostrarBotonReiniciar();
        return;
    }

    // Genera número aleatorio y selecciona amigo
    const indiceAleatorio = Math.floor(Math.random() * amigosDisponibles.length);
    const amigoSorteado = amigosDisponibles[indiceAleatorio];
    
    //Agregar a la lista de sorteados
    estado.amigosSorteados.push(amigoSorteado);

    // Muestra el resultado
    mostrarResultado(amigoSorteado);
    
    const restantes = amigosDisponibles.length - 1;
    if (restantes > 0) {
        mostrarMensaje(`¡Sorteo realizado! Quedan ${restantes} amigos por sortear`, 'success');
    } else {
        mostrarMensaje('¡Último amigo sorteado! Ya se eligieron todos', 'success');
    }
}

//Mostrar resultado del sorteo
function mostrarResultado(amigo) {
    const resultadoUl = document.getElementById('resultado');
    if (!resultadoUl) return;
    
    //Calcular amigos disponibles y si ya terminó
    const amigosDisponibles = estado.listaDeAmigos.filter(a => !estado.amigosSorteados.includes(a));
    const yaTermino = amigosDisponibles.length === 0;
    
    resultadoUl.innerHTML = `
        <li class="result-item">
            <div class="result-content">
                <span class="result-label">Tu amigo secreto es:</span>
                <span class="result-name">${amigo}</span>
                
                <!--Contador de progreso -->
                <div class="sorteo-info">
                    <small style="color: #666; font-size: 10px;">
                        Sorteado ${estado.amigosSorteados.length} de ${estado.listaDeAmigos.length}
                    </small>
                </div>
            </div>
            
            <!-- Botones condicionales -->
            ${yaTermino 
                ? `<button onclick="reiniciarSorteos()" style="...">🔄 Empezar de nuevo</button>`
                : `<button onclick="nuevoSorteo()" style="...">🎲 Sortear otro</button>`
            }
        </li>
    `;
}

//Preparar nuevo sorteo
function nuevoSorteo() {
    limpiarResultado();
    mostrarMensaje('Listo para un nuevo sorteo', 'info');
}

//Limpiar resultados del sorteo
function limpiarResultado() {
    const resultadoUl = document.getElementById('resultado');
    if (resultadoUl) {
        resultadoUl.innerHTML = '';
    }
}


//Actualizar contador de lugares disponibles
function actualizarDisponibles() {
    if (!estado.elementos.disponibles) return;
    const disponibles = config.limite_amigos - estado.listaDeAmigos.length;
    const plural = disponibles === 1 ? 'puesto' : 'puestos';

    estado.elementos.disponibles.textContent = `Quedan ${disponibles} ${plural} disponibles.`;
}

//Mensaje para mostrar a usuario
function mostrarMensaje(mensaje, tipo = 'info') {
    //elimina el mensaje anterior
    const mensajeAnterior = document.querySelector('.mensaje-temporal');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    //crea nuevo mensaje
    const div = document.createElement('div');
    div.className = `mensaje-temporal mensaje-${tipo}`;
    div.textContent = mensaje;

    //Insertamos el DOM
    const inputWrapper = estado.elementos.input.parentNode;
    inputWrapper.insertAdjacentElement('afterend', div);

}

function manejarEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        agregarAmigo();
    }
}



//Iniciar el juego
function inicializar() {
    inicializarElementos();

    //configuración de eventos
    if (estado.elementos.input) {
        estado.elementos.input.addEventListener('keypress', manejarEnter);
        estado.elementos.input.focus();
    }


    mostrarLista();
    actualizarDisponibles();

    console.log('Aplicación inicializada correctamente');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}