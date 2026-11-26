
// ==========================================
// SERVICIO DE CONEXIÓN CON CONALTURA
// ==========================================

// ==========================================
// VALIDAR RESPUESTAS DE LA API
// ==========================================

async function validarRespuesta(respuesta) {
    if (!respuesta.ok) {
        let mensaje = "";

        try {
            const datosError = await respuesta.json();
            mensaje = datosError?.error?.mensaje || "";
        } catch (error) {
            // La respuesta no contenía un JSON válido.
        }

        const error = new Error(
            respuesta.status === 401
                ? "No se pudo autenticar el acceso a los inmuebles. Verifica la configuración de acceso."
                : mensaje || `Error del servidor. Código: ${respuesta.status}`
        );

        error.status = respuesta.status;

        throw error;
    }

    return await respuesta.json();
}


// ==========================================
// CONSULTAR UNA PÁGINA DE INMUEBLES
// ==========================================

async function obtenerInmuebles(pagina = 1, porPagina = 50) {
    try {
        const respuesta = await fetch(
            `${CONFIG.API_URL}/inmuebles?pagina=${pagina}&por_pagina=${porPagina}`,
            {
                method: "GET",
                headers: {
                    "X-API-Key": CONFIG.API_KEY
                }
            }
        );

        return await validarRespuesta(respuesta);

    } catch (error) {
        if (error.status) {
            throw error;
        }

        if (error instanceof TypeError) {
            throw new Error(
                "No fue posible conectar con el servidor. Comprueba tu conexión e inténtalo nuevamente."
            );
        }

        throw error;
    }
}


// ==========================================
// CONSULTAR TODOS LOS INMUEBLES
// ==========================================

async function obtenerTodosLosInmuebles() {
    const primeraRespuesta = await obtenerInmuebles(1, 50);

    let todosLosInmuebles = [...primeraRespuesta.datos];

    const totalPaginas = primeraRespuesta.total_paginas;

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        const respuesta = await obtenerInmuebles(pagina, 50);

        todosLosInmuebles.push(...respuesta.datos);
    }

    return todosLosInmuebles;
}


// ==========================================
// CONSULTAR CIUDADES
// ==========================================

async function obtenerCiudades() {
    try {
        const respuesta = await fetch(`${CONFIG.API_URL}/ciudades`, {
            method: "GET",
            headers: {
                "X-API-Key": CONFIG.API_KEY
            }
        });

        return await validarRespuesta(respuesta);

    } catch (error) {
        if (error.status) {
            throw error;
        }

        if (error instanceof TypeError) {
            throw new Error(
                "No fue posible conectar con el servidor al consultar las ciudades."
            );
        }

        throw error;
    }
}


// ==========================================
// OBTENER DETALLE DE UN INMUEBLE
// ==========================================

async function obtenerDetalleInmueble(id) {
    try {
        const respuesta = await fetch(
            `${CONFIG.API_URL}/inmuebles/${id}`,
            {
                method: "GET",
                headers: {
                    "X-API-Key": CONFIG.API_KEY
                }
            }
        );

        return await validarRespuesta(respuesta);

    } catch (error) {
        if (error.status) {
            throw error;
        }

        if (error instanceof TypeError) {
            throw new Error(
                "No fue posible conectar con el servidor para consultar el detalle."
            );
        }

        throw error;
    }
}
