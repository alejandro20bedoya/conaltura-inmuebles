
/**
 * Funciones encargadas de mostrar los inmuebles
 * en la interfaz de usuario.
 */


// ==========================================
// FORMATEAR PRECIOS EN PESOS COLOMBIANOS
// ==========================================

function formatearPrecio(precio) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(precio);

}


// ==========================================
// CREAR UNA TARJETA DE INMUEBLE
// ==========================================

function crearTarjetaInmueble(inmueble) {

    const columna = document.createElement("div");

    columna.className = "col-12 col-md-6 col-lg-4";

    const tarjeta = document.createElement("div");

    tarjeta.className = "card inmueble-card h-100";


    // IMAGEN

    const imagen = document.createElement("img");

    imagen.className = "card-img-top inmueble-imagen";

    imagen.src = inmueble.foto_principal || "assets/img/sin-imagen.svg";

    imagen.alt = inmueble.titulo || "Inmueble";

    imagen.onerror = function () {

        this.onerror = null;

        this.src = "assets/img/sin-imagen.svg";

    };


    // CONTENIDO

    const contenido = document.createElement("div");

    contenido.className = "card-body";


    // OPERACIÓN

    const operacion = document.createElement("span");

    operacion.className = "badge bg-primary mb-2";

    operacion.textContent = inmueble.operacion || "Sin operación";


    // TÍTULO

    const titulo = document.createElement("h5");

    titulo.className = "card-title";

    titulo.textContent = inmueble.titulo || "Inmueble sin título";


    // UBICACIÓN

    const ubicacion = document.createElement("p");

    ubicacion.className = "text-muted mb-2";

    ubicacion.textContent =
        `${inmueble.barrio || "Sin barrio"}, ${inmueble.ciudad || "Sin ciudad"}`;


    // PRECIO

    const precio = document.createElement("h5");

    precio.className = "inmueble-precio";

    precio.textContent = formatearPrecio(inmueble.precio);

    if (inmueble.operacion === "arriendo") {

        precio.textContent += "/mes";

    }


    // CARACTERÍSTICAS

    const caracteristicas = document.createElement("div");

    caracteristicas.className =
        "d-flex justify-content-between mt-3 inmueble-caracteristicas";

    caracteristicas.textContent =
        `${inmueble.area_m2 ?? "N/D"} m² | ` +
        `${inmueble.habitaciones ?? "N/D"} habitaciones | ` +
        `${inmueble.banos ?? "N/D"} baños`;


    // BOTÓN PARA VER DETALLES

    const botonDetalle = document.createElement("button");

    botonDetalle.type = "button";

    botonDetalle.className =
        "btn btn-outline-primary w-100 mt-3";

    botonDetalle.textContent = "Ver detalles";

    botonDetalle.addEventListener("click", function () {

        verDetalleInmueble(inmueble.id);

    });


    // UNIR ELEMENTOS AL CONTENIDO

    contenido.append(
        operacion,
        titulo,
        ubicacion,
        precio,
        caracteristicas,
        botonDetalle
    );


    // UNIR IMAGEN Y CONTENIDO A LA TARJETA

    tarjeta.append(imagen, contenido);

    columna.appendChild(tarjeta);

    return columna;

}


// ==========================================
// MOSTRAR LOS INMUEBLES EN PANTALLA
// ==========================================

function mostrarInmuebles(inmuebles) {

    const contenedor = document.getElementById("contenedorInmuebles");

    const contador = document.getElementById("contadorInmuebles");

    const estado = document.getElementById("estadoAplicacion");

    contenedor.replaceChildren();

    contador.textContent =
        `${inmuebles.length} inmuebles encontrados`;


    // SI NO HAY RESULTADOS

    if (inmuebles.length === 0) {

        estado.textContent = "No se encontraron inmuebles.";

        return;

    }

    estado.textContent = "";


    // RECORRER Y MOSTRAR INMUEBLES

    inmuebles.forEach(function (inmueble) {

        const tarjeta = crearTarjetaInmueble(inmueble);

        contenedor.appendChild(tarjeta);

    });

}


/* ==========================================
   MOSTRAR DETALLE DEL INMUEBLE
========================================== */


/* ==========================================
   MOSTRAR DETALLE DEL INMUEBLE
========================================== */

async function verDetalleInmueble(id) {

    const modalElemento = document.getElementById(
        "modalDetalleInmueble"
    );

    const contenido = document.getElementById(
        "detalleContenido"
    );

    const titulo = document.getElementById(
        "detalleTitulo"
    );

    const modal = bootstrap.Modal.getOrCreateInstance(
        modalElemento
    );

    modal.show();

    titulo.textContent = "Detalle del inmueble";

    contenido.replaceChildren();

    const mensaje = document.createElement("p");

    mensaje.className = "text-center my-4";

    mensaje.textContent = "Cargando información del inmueble...";

    contenido.appendChild(mensaje);

    try {

        // CONSULTAR DETALLE EN LA API

        const respuesta = await obtenerDetalleInmueble(id);

        const inmueble = respuesta.datos ?? respuesta;

        titulo.textContent =
            inmueble.titulo || "Detalle del inmueble";

        contenido.replaceChildren();


        // CONTENEDOR PRINCIPAL

        const fila = document.createElement("div");

        fila.className = "row g-4";



        // ======================================
        // GALERÍA PROFESIONAL DE FOTOGRAFÍAS
        // ======================================

        const columnaFotos = document.createElement("div");
        columnaFotos.className = "col-12 col-lg-7";

        const galeria = document.createElement("div");
        galeria.className = "detalle-galeria-container";

        // Obtener fotografías
        const fotos = Array.isArray(inmueble.fotos)
            ? inmueble.fotos.filter(foto =>
                typeof foto === "string" && foto.trim() !== ""
            )
            : [];

        // Si no hay galería, utilizar la foto principal
        if (fotos.length === 0 && inmueble.foto_principal) {
            fotos.push(inmueble.foto_principal);
        }

        // Imagen principal
        const imagenPrincipal = document.createElement("img");

        imagenPrincipal.className = "detalle-imagen-principal";

        imagenPrincipal.alt = "Fotografía del inmueble";

        imagenPrincipal.src = fotos[0] || "assets/img/sin-imagen.svg";

        imagenPrincipal.onerror = function () {
            this.onerror = null;
            this.src = "assets/img/sin-imagen.svg";
        };

        // Contador de fotografías
        const contadorFotos = document.createElement("span");

        contadorFotos.className = "detalle-contador-fotos";

        contadorFotos.textContent = `1 / ${fotos.length}`;

        // Botón anterior
        const botonAnterior = document.createElement("button");

        botonAnterior.type = "button";
        botonAnterior.className = "detalle-flecha detalle-anterior";
        botonAnterior.textContent = "‹";
        botonAnterior.setAttribute("aria-label", "Fotografía anterior");

        // Botón siguiente
        const botonSiguiente = document.createElement("button");

        botonSiguiente.type = "button";
        botonSiguiente.className = "detalle-flecha detalle-siguiente";
        botonSiguiente.textContent = "›";
        botonSiguiente.setAttribute("aria-label", "Fotografía siguiente");

        // Contenedor de imagen principal
        const visor = document.createElement("div");

        visor.className = "detalle-visor";

        visor.append(
            imagenPrincipal,
            contadorFotos,
            botonAnterior,
            botonSiguiente
        );

        // Contenedor de miniaturas
        const miniaturas = document.createElement("div");

        miniaturas.className = "detalle-miniaturas";

        // Posición actual
        let fotoActual = 0;

        // Función para cambiar fotografía
        function cambiarFoto(indice) {

            if (fotos.length === 0) return;

            fotoActual = (indice + fotos.length) % fotos.length;

            imagenPrincipal.src = fotos[fotoActual];

            contadorFotos.textContent =
                `${fotoActual + 1} / ${fotos.length}`;

            imagenPrincipal.onerror = function () {
                this.onerror = null;
                this.src = "assets/img/sin-imagen.svg";
            };

            // Actualizar miniaturas activas
            miniaturas.querySelectorAll(".detalle-miniatura")
                .forEach((miniatura, posicion) => {

                    miniatura.classList.toggle(
                        "activa",
                        posicion === fotoActual
                    );

                });

            // Llevar la miniatura seleccionada a la vista
            const seleccionada = miniaturas.children[fotoActual];

            if (seleccionada) {
                seleccionada.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });
            }
        }

        // Crear miniaturas
        fotos.forEach((foto, indice) => {

            const miniatura = document.createElement("button");

            miniatura.type = "button";

            miniatura.className = "detalle-miniatura";

            miniatura.setAttribute(
                "aria-label",
                `Ver fotografía ${indice + 1}`
            );

            const imagenMiniatura = document.createElement("img");

            imagenMiniatura.src = foto;

            imagenMiniatura.alt = `Miniatura ${indice + 1}`;

            imagenMiniatura.onerror = function () {
                this.onerror = null;
                this.src = "assets/img/sin-imagen.svg";
            };

            miniatura.appendChild(imagenMiniatura);

            miniatura.addEventListener("click", () => {
                cambiarFoto(indice);
            });

            miniaturas.appendChild(miniatura);

        });

        // Eventos de navegación
        botonAnterior.addEventListener("click", () => {
            cambiarFoto(fotoActual - 1);
        });

        botonSiguiente.addEventListener("click", () => {
            cambiarFoto(fotoActual + 1);
        });

        // Ocultar flechas cuando solo hay una fotografía
        if (fotos.length <= 1) {

            botonAnterior.hidden = true;
            botonSiguiente.hidden = true;

        }

        // Mostrar contador solamente si hay fotografías
        if (fotos.length === 0) {
            contadorFotos.textContent = "Sin fotografías";
        }

        // Unir galería
        galeria.append(visor, miniaturas);

        columnaFotos.appendChild(galeria);


        // ======================================
        // INFORMACIÓN DEL INMUEBLE
        // ======================================

        const columnaInfo = document.createElement("div");

        columnaInfo.className = "col-12 col-lg-5";


        // OPERACIÓN

        const operacion = document.createElement("span");

        operacion.className = "badge bg-primary mb-2";

        operacion.textContent = inmueble.operacion || "Sin operación";


        // TÍTULO

        const nombre = document.createElement("h4");

        nombre.textContent = inmueble.titulo || "Inmueble";


        // PRECIO

        const precio = document.createElement("h3");

        precio.className = "text-primary my-3";

        precio.textContent = formatearPrecio(inmueble.precio);

        if (inmueble.operacion === "arriendo") {
            precio.textContent += "/mes";
        }


        // UBICACIÓN

        const ubicacion = document.createElement("p");

        ubicacion.className = "text-muted";

        ubicacion.textContent =
            `${inmueble.barrio || "Sin barrio"}, ${inmueble.ciudad || "Sin ciudad"}`;


        // CARACTERÍSTICAS

        const caracteristicas = document.createElement("div");

        caracteristicas.className = "border rounded p-3 my-3";

        const datosCaracteristicas = [
            ["Tipo", inmueble.tipo],
            ["Área", inmueble.area_m2 ? `${inmueble.area_m2} m²` : "N/D"],
            ["Habitaciones", inmueble.habitaciones ?? "N/D"],
            ["Baños", inmueble.banos ?? "N/D"],
            ["Parqueaderos", inmueble.parqueaderos ?? "N/D"],
            ["Estrato", inmueble.estrato ?? "N/D"]
        ];

        datosCaracteristicas.forEach(([etiqueta, valor]) => {

            const parrafo = document.createElement("p");

            parrafo.className = "mb-2";

            const negrita = document.createElement("strong");

            negrita.textContent = `${etiqueta}: `;

            parrafo.append(
                negrita,
                document.createTextNode(String(valor ?? "N/D"))
            );

            caracteristicas.appendChild(parrafo);

        });


        // ADMINISTRACIÓN

        if (inmueble.administracion !== undefined &&
            inmueble.administracion !== null) {

            const administracion = document.createElement("p");

            administracion.className = "mb-2";

            administracion.textContent =
                `Administración: ${formatearPrecio(inmueble.administracion)}`;

            caracteristicas.appendChild(administracion);
        }


        // DESCRIPCIÓN

        const seccionDescripcion = document.createElement("div");

        seccionDescripcion.className = "detalle-descripcion-completa";

        const tituloDescripcion = document.createElement("h5");

        tituloDescripcion.textContent = "Descripción del inmueble";

        const descripcion = document.createElement("p");

        descripcion.textContent =
            inmueble.descripcion || "No hay descripción disponible.";

        seccionDescripcion.append(
            tituloDescripcion,
            descripcion
        );


        // ======================================
        // UNIR INFORMACIÓN DEL INMUEBLE
        // ======================================

        columnaInfo.append(
            operacion,
            nombre,
            precio,
            ubicacion,
            caracteristicas
        );

        // ======================================
        // MOSTRAR GALERÍA E INFORMACIÓN
        // ======================================

        fila.append(
            columnaFotos,
            columnaInfo
        );

        // ======================================
        // AGREGAR DESCRIPCIÓN DEBAJO
        // ======================================

        contenido.append(
            fila,
            seccionDescripcion
        );

    } catch (error) {

        contenido.replaceChildren();

        const mensajeError = document.createElement("div");

        mensajeError.className = "alert alert-danger";

        mensajeError.textContent =
            "No fue posible cargar el detalle del inmueble. Intenta nuevamente.";

        contenido.appendChild(mensajeError);

        console.error("Error al cargar detalle:", error);

    }

}

