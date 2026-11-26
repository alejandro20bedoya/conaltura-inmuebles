
// NORMALIZAR TEXTO

function normalizarTexto(texto) {
    return String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// FORMATEAR PRECIOS COLOMBIANOS

function formatearPrecioInput(valor) {
    const numeros = String(valor).replace(/\D/g, "");

    if (numeros === "") {
        return "";
    }

    return Number(numeros).toLocaleString("es-CO");
}


// OBTENER PRECIO NUMÉRICO

function obtenerPrecioNumerico(valor) {
    const numeros = String(valor ?? "").replace(/\D/g, "");

    return numeros === "" ? null : Number(numeros);
}


// APLICAR TODOS LOS FILTROS

function aplicarFiltros() {

    let resultados = [...listaInmuebles];

    // FILTRO POR OPERACIÓN
    if (filtrosActuales.operacion !== "") {
        resultados = resultados.filter(inmueble =>
            normalizarTexto(inmueble.operacion) ===
            normalizarTexto(filtrosActuales.operacion)
        );
    }

    // FILTRO POR TIPO DE INMUEBLE
    if (filtrosActuales.tipo !== "") {
        resultados = resultados.filter(inmueble =>
            normalizarTexto(inmueble.tipo) ===
            normalizarTexto(filtrosActuales.tipo)
        );
    }

    // FILTRO POR CIUDAD
    if (filtrosActuales.ciudad !== "") {
        resultados = resultados.filter(inmueble =>
            normalizarTexto(inmueble.ciudad) ===
            normalizarTexto(filtrosActuales.ciudad)
        );
    }

    // FILTRO POR PRECIO MÍNIMO Y MÁXIMO
    const precioMinimo = obtenerPrecioNumerico(
        filtrosActuales.precioMinimo
    );

    const precioMaximo = obtenerPrecioNumerico(
        filtrosActuales.precioMaximo
    );

    if (precioMinimo !== null || precioMaximo !== null) {

        resultados = resultados.filter(inmueble => {

            const precio = Number(inmueble.precio);

            if (!Number.isFinite(precio)) {
                return false;
            }

            if (precioMinimo !== null && precio < precioMinimo) {
                return false;
            }

            if (precioMaximo !== null && precio > precioMaximo) {
                return false;
            }

            return true;
        });
    }

    // FILTRO POR HABITACIONES
    if (Number(filtrosActuales.habitaciones) > 0) {
        resultados = resultados.filter(inmueble =>
            Number(inmueble.habitaciones) >=
            Number(filtrosActuales.habitaciones)
        );
    }

    // FILTRO POR TEXTO: TÍTULO Y BARRIO
    if (filtrosActuales.busqueda !== "") {

        const busqueda = normalizarTexto(
            filtrosActuales.busqueda
        );

        resultados = resultados.filter(inmueble => {

            const titulo = normalizarTexto(inmueble.titulo);
            const barrio = normalizarTexto(inmueble.barrio);

            return titulo.includes(busqueda) ||
                barrio.includes(busqueda);
        });
    }

    // ORDENAR RESULTADOS
    if (filtrosActuales.ordenar === "menor-precio") {

        resultados.sort((a, b) =>
            Number(a.precio) - Number(b.precio)
        );

    } else if (filtrosActuales.ordenar === "mayor-precio") {

        resultados.sort((a, b) =>
            Number(b.precio) - Number(a.precio)
        );

    } else if (filtrosActuales.ordenar === "recientes") {

        resultados.sort((a, b) =>
            new Date(b.publicado || 0) -
            new Date(a.publicado || 0)
        );
    }

    // ACTUALIZAR RESULTADOS
    inmueblesFiltrados = resultados;

    mostrarInmuebles(inmueblesFiltrados);
}


// INICIALIZAR EVENTOS DE LOS FILTROS

function inicializarEventosFiltros() {

    // OPERACIÓN: TODOS, VENTA Y ARRIENDO

    document.querySelectorAll(".btn-operacion").forEach(boton => {

        boton.addEventListener("click", function () {

            filtrosActuales.operacion =
                this.dataset.operacion === "todos"
                    ? ""
                    : this.dataset.operacion;

            document.querySelectorAll(".btn-operacion")
                .forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

            aplicarFiltros();
        });
    });


    // TIPO DE INMUEBLE

    const filtroTipo = document.getElementById("filtroTipo");

    if (filtroTipo) {
        filtroTipo.addEventListener("change", function () {

            filtrosActuales.tipo = this.value;

            aplicarFiltros();
        });
    }


    // EVENTO DEL SELECTOR DE CIUDADES

    const filtroCiudad = document.getElementById("filtroCiudad");

    if (filtroCiudad) {

        filtroCiudad.addEventListener("change", function () {

            filtrosActuales.ciudad = this.value;

            aplicarFiltros();
        });
    }

    // PRECIOS: FORMATO COLOMBIANO

    const campoPrecioMinimo =
        document.getElementById("precioMinimo");

    const campoPrecioMaximo =
        document.getElementById("precioMaximo");

    [campoPrecioMinimo, campoPrecioMaximo].forEach(campo => {

        if (!campo) return;

        campo.addEventListener("input", function () {

            // Formatear automáticamente con puntos
            this.value = formatearPrecioInput(this.value);

            // Guardar solamente los números
            filtrosActuales[this.id] =
                this.value.replace(/\D/g, "");

            aplicarFiltros();
        });
    });


    // --------------------------------------
    // HABITACIONES
    // --------------------------------------

    document.querySelectorAll(".btn-habitaciones")
        .forEach(boton => {

            boton.addEventListener("click", function () {

                filtrosActuales.habitaciones =
                    Number(this.dataset.habitaciones);

                document.querySelectorAll(".btn-habitaciones")
                    .forEach(btn => btn.classList.remove("active"));

                this.classList.add("active");

                aplicarFiltros();
            });
        });


    // --------------------------------------
    // BÚSQUEDA POR TÍTULO O BARRIO
    // --------------------------------------

    const buscarTexto = document.getElementById("buscarTexto");

    if (buscarTexto) {

        buscarTexto.addEventListener("input", function () {

            filtrosActuales.busqueda = this.value;

            aplicarFiltros();
        });
    }


    // --------------------------------------
    // ORDENAR INMUEBLES
    // --------------------------------------

    const ordenarInmuebles =
        document.getElementById("ordenarInmuebles");

    if (ordenarInmuebles) {

        ordenarInmuebles.addEventListener("change", function () {

            filtrosActuales.ordenar = this.value;

            aplicarFiltros();
        });
    }


    // --------------------------------------
    // LIMPIAR FILTROS
    // --------------------------------------

    const botonLimpiar =
        document.getElementById("limpiarFiltros");

    if (botonLimpiar) {

        botonLimpiar.addEventListener("click", limpiarFiltros);
    }
}


// ==========================================
// LIMPIAR TODOS LOS FILTROS
// ==========================================

function limpiarFiltros() {

    filtrosActuales = {
        operacion: "",
        tipo: "",
        ciudad: "",
        precioMinimo: "",
        precioMaximo: "",
        habitaciones: 0,
        busqueda: "",
        ordenar: "recientes"
    };

    // Limpiar campos
    document.getElementById("filtroTipo").value = "";
    document.getElementById("filtroCiudad").value = "";

    document.getElementById("precioMinimo").value = "";
    document.getElementById("precioMaximo").value = "";

    document.getElementById("buscarTexto").value = "";

    document.getElementById("ordenarInmuebles").value = "recientes";

    // Reiniciar botones de operación
    document.querySelectorAll(".btn-operacion")
        .forEach(boton => {

            boton.classList.remove("active");

            if (boton.dataset.operacion === "todos") {
                boton.classList.add("active");
            }
        });

    // Reiniciar botones de habitaciones
    document.querySelectorAll(".btn-habitaciones")
        .forEach(boton => {

            boton.classList.remove("active");

            if (Number(boton.dataset.habitaciones) === 0) {
                boton.classList.add("active");
            }
        });

    // Mostrar nuevamente todos los inmuebles
    aplicarFiltros();
}
