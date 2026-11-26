
// ==========================================
// VARIABLES GLOBALES
// ==========================================

let listaInmuebles = [];
let inmueblesFiltrados = [];

let eventosFiltrosInicializados = false;

let filtrosActuales = {
    operacion: "",
    tipo: "",
    ciudad: "",
    precioMinimo: "",
    precioMaximo: "",
    habitaciones: 0,
    busqueda: "",
    ordenar: "recientes"
};


// ==========================================
// MOSTRAR ESTADOS Y MENSAJES
// ==========================================

function mostrarEstado(mensaje, tipo = "info", permitirReintento = false) {
    const estado = document.getElementById("estadoAplicacion");

    if (!estado) return;

    estado.replaceChildren();
    estado.dataset.tipo = tipo;

    if (!mensaje) return;

    const texto = document.createElement("p");
    texto.textContent = mensaje;
    texto.className = "mb-2";

    estado.appendChild(texto);

    if (permitirReintento) {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = "Reintentar";
        boton.className = "btn btn-primary mt-2";

        boton.addEventListener("click", iniciarAplicacion);

        estado.appendChild(boton);
    }
}


// ==========================================
// ERROR AL CARGAR CIUDADES
// ==========================================

function mostrarErrorCiudades() {
    mostrarEstado(
        "Los inmuebles se cargaron, pero no fue posible cargar las ciudades. Intenta nuevamente.",
        "error",
        true
    );
}


// ==========================================
// CARGAR CIUDADES DESDE LA API
// ==========================================

async function cargarCiudades() {
    const selector = document.getElementById("filtroCiudad");

    try {
        const respuesta = await obtenerCiudades();

        if (!respuesta || !Array.isArray(respuesta.datos)) {
            throw new Error(
                "La respuesta de ciudades no tiene el formato esperado."
            );
        }

        if (!selector) {
            return false;
        }

        selector.replaceChildren();

        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = "Todas las ciudades";

        selector.appendChild(opcionInicial);

        respuesta.datos.forEach(ciudad => {
            const nombreCiudad =
                typeof ciudad === "string" ? ciudad : ciudad.nombre;

            if (!nombreCiudad) return;

            const opcion = document.createElement("option");
            opcion.value = nombreCiudad;
            opcion.textContent = nombreCiudad;

            selector.appendChild(opcion);
        });

        return true;

    } catch (error) {
        console.error("Error al cargar ciudades:", error);
        return false;
    }
}


// ==========================================
// INICIAR APLICACIÓN
// ==========================================

async function iniciarAplicacion() {
    try {
        mostrarEstado("Cargando inmuebles...");

        listaInmuebles = await obtenerTodosLosInmuebles();

        const ciudadesCargadas = await cargarCiudades();

        if (!eventosFiltrosInicializados) {
            inicializarEventosFiltros();
            eventosFiltrosInicializados = true;
        }

        aplicarFiltros();

        if (!ciudadesCargadas) {
            mostrarErrorCiudades();
        } else {
            mostrarEstado("");
        }

    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);

        mostrarEstado(
            error.message || "No fue posible cargar los inmuebles.",
            "error",
            true
        );
    }
}


// ==========================================
// EJECUTAR APLICACIÓN
// ==========================================

iniciarAplicacion();
