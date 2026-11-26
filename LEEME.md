# Prueba técnica – Desarrollador Junior
## Conaltura Inmobiliaria

Aplicación web para consultar, visualizar y filtrar inmuebles de Conaltura Inmobiliaria mediante el consumo de su API.

## 1. Tecnologías utilizadas

- HTML5: estructura de la aplicación.
- CSS3: estilos y diseño responsive.
- Bootstrap 5: componentes y distribución de la interfaz.
- Bootstrap Icons: iconografía.
- JavaScript: consumo de la API, manejo de datos, filtros y funcionalidades interactivas.
- Git y GitHub: control de versiones y publicación del código.

## 2. Requisitos para ejecutar el proyecto

- Navegador web actualizado.
- Visual Studio Code.
- Extensión Live Server o un servidor web local.
- Llave de acceso válida para la API de Conaltura.

## 3. Instalación y configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/alejandro20bedoya/conaltura-inmuebles.git
```

2. Abrir la carpeta del proyecto en Visual Studio Code.

3. Dentro de `assets/js/`, crear el archivo `config.js`, tomando como referencia `config.ejemplo.js`.

4. Configurar la URL de la API y la llave personal:

```javascript
const CONFIG = {
    API_URL: "https://www.conalturainmobiliaria.com/api-prueba",
    API_KEY: "TU_LLAVE_PERSONAL"
};
```

5. Guardar el archivo y ejecutar `index.html` mediante Live Server.

**Importante:** El archivo `config.js` está excluido del repositorio mediante `.gitignore`. No se debe publicar la llave personal.

## 4. Consumo de la API y paginación

La aplicación consume los siguientes endpoints:

- `GET /inmuebles?pagina=1&por_pagina=50`: consulta los inmuebles de forma paginada.
- `GET /ciudades`: obtiene las ciudades disponibles para el filtro.
- `GET /inmuebles/{id}`: consulta la información detallada de un inmueble.

Para obtener todos los inmuebles se implementó una consulta inicial de 50 registros y posteriormente se recorren las páginas restantes utilizando el valor `total_paginas` entregado por la API.

De esta manera, se reúnen los registros en una lista general para permitir que los filtros trabajen sobre todos los inmuebles disponibles.

## 5. Funcionamiento de los filtros

Los filtros se implementaron con JavaScript, debido a que la API entrega los registros paginados y no realiza directamente las búsquedas solicitadas.

La aplicación permite filtrar por:

- Operación: venta y arriendo.
- Tipo de inmueble.
- Ciudad.
- Precio mínimo y máximo.
- Número mínimo de habitaciones.
- Búsqueda por título o barrio.
- Ordenamiento por precio ascendente, descendente y fecha de publicación.

Los filtros se pueden combinar y se aplican sin necesidad de recargar la página.

También se implementó la normalización de texto para permitir búsquedas sin distinguir mayúsculas ni tildes.

## 6. Funcionalidades implementadas

- Listado de inmuebles mediante tarjetas.
- Visualización de fotografías y una imagen de reemplazo cuando no hay fotografía disponible.
- Presentación de precios en pesos colombianos.
- Diseño responsive para dispositivos móviles, tabletas y computadores.
- Detalle de cada inmueble mediante una ventana modal.
- Galería de fotografías con navegación.
- Descripción y características del inmueble.
- Contador de inmuebles encontrados.
- Botón para limpiar los filtros.
- Mensajes para estados de carga y resultados sin coincidencias.
- Manejo de errores de autenticación y conexión.
- Botón para reintentar la carga de información.

## 7. Seguridad

La llave de acceso a la API se mantiene en el archivo local `assets/js/config.js`, excluido del seguimiento de Git mediante `.gitignore`.

El repositorio incluye un archivo de ejemplo sin credenciales reales para facilitar la configuración del proyecto.

Para una publicación pública funcional se recomienda utilizar un intermediario en el servidor, de manera que la llave no quede expuesta en el navegador.

## 8. Aspectos pendientes y posibles mejoras

Como mejoras futuras se consideran:

- Implementar un intermediario PHP para proteger la llave de acceso y almacenar respuestas en caché.
- Permitir compartir búsquedas mediante parámetros en la URL.
- Implementar un sistema de favoritos o solicitudes de interés con MySQL.
- Integrar notificaciones mediante n8n.
- Publicar la aplicación en un servicio de alojamiento web.


## 9. Repositorio

Código fuente del proyecto:

https://github.com/alejandro20bedoya/conaltura-inmuebles
