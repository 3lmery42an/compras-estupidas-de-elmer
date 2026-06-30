# Collector Purchase Tracker

Aplicacion web para organizar compras, wishlist y coleccion personal de comics, mangas, figuras y otros articulos coleccionables.

La app permite registrar articulos pendientes o conseguidos, anadir precio, tienda, formato, prioridad, estado de lectura, notas e imagenes. Tambien incluye busqueda, filtros, estadisticas y exportacion/importacion de datos en JSON.

## Demo

Sitio publicado con GitHub Pages:

[Ver demo en vivo](https://3lmery42an.github.io/compras-estupidas-de-elmer/)

Herramienta para exportar datos de `localStorage`:

[Exportar localStorage](https://3lmery42an.github.io/compras-estupidas-de-elmer/localstorage-export.html)

## Screenshots

Pendiente agregar capturas de pantalla de:

- Dashboard principal.
- Formulario de nuevo articulo.
- Catalogo con tarjetas.
- Vista movil.

## Funcionalidades

- Agregar comics, mangas y figuras.
- Clasificar articulos como pendientes o conseguidos.
- Guardar precio, tienda, serie/linea, fecha, notas e imagen.
- Asignar prioridad: alta, media o baja.
- Registrar estado de lectura: no leido, por leer o leido.
- Filtrar por estado y tipo de articulo.
- Buscar por titulo, serie, tienda, notas o formato.
- Ordenar por fecha, prioridad, precio o titulo.
- Exportar e importar el catalogo en formato JSON.
- Guardar datos localmente usando `localStorage`.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage
- GitHub Pages
- Google Custom Search API, opcional para busqueda de imagenes

## Instalacion local

Clona el repositorio:

```bash
git clone https://github.com/3lmery42an/compras-estupidas-de-elmer.git
```

Entra al proyecto:

```bash
cd compras-estupidas-de-elmer
```

Abre `index.html` en el navegador o usa una extension como Live Server.

## Uso

1. Completa el formulario con los datos del articulo.
2. Selecciona tipo, estado, prioridad y formato.
3. Anade una imagen por URL, archivo local o busqueda externa.
4. Guarda el articulo.
5. Usa los filtros y la busqueda para organizar el catalogo.
6. Exporta tu catalogo como respaldo JSON.

## Backup y transferencia de datos

Los datos se guardan en el navegador donde usas la app. Si agregas articulos abriendo `index.html` localmente, esos datos no aparecen automaticamente en el sitio publico de GitHub Pages.

Para mover tus datos:

1. Abre la version donde si ves tus comics/items.
2. Presiona `Exportar`.
3. Abre el [sitio publico](https://3lmery42an.github.io/compras-estupidas-de-elmer/).
4. Presiona `Importar` y selecciona el archivo JSON descargado.
5. Acepta reemplazar el catalogo si quieres que quede igual.

Tambien puedes abrir `localstorage-export.html` desde el mismo origen donde estan tus datos para descargar un respaldo JSON.

## Privacidad

Los datos se guardan en el navegador mediante `localStorage`. No existe una base de datos remota. Esto significa que los datos no se sincronizan automaticamente entre dispositivos o navegadores.

Si usas una API key de Google Custom Search, configura restricciones de seguridad en Google Cloud antes de usarla.

## Limitaciones actuales

- Los datos solo existen en el navegador donde se guardaron.
- Las imagenes locales se convierten a base64 y pueden ocupar mucho espacio.
- No hay autenticacion de usuario.
- No hay sincronizacion en la nube.
- No hay pruebas automatizadas todavia.

## Roadmap

- Modo oscuro.
- Presupuesto mensual.
- Graficas de gasto.
- Tags personalizados.
- Estadisticas avanzadas.
- PWA instalable.
- Mejor sistema de backup.
- Pruebas unitarias y end-to-end.
- Migracion a arquitectura modular.

## Autor

Desarrollado por Elmer Cabrera.

## Licencia

MIT License.
