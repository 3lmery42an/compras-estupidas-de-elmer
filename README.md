# Collector Purchase Tracker

Aplicacion web para organizar compras, wishlist y coleccion personal de comics, mangas, libros, figuras y otros articulos coleccionables.

La app permite registrar articulos pendientes o conseguidos, anadir precio, tienda, formato, prioridad, estado de lectura, progreso, notas e imagenes. Tambien incluye busqueda, filtros, estadisticas y exportacion/importacion de datos en JSON.

## Demo

Sitio publicado con GitHub Pages:

[Ver demo en vivo](https://3lmery42an.github.io/Collection/)

Herramienta para exportar datos de `localStorage`:

[Exportar localStorage](https://3lmery42an.github.io/Collection/localstorage-export.html)

## Screenshots

Pendiente agregar capturas de pantalla de:

- Dashboard principal.
- Formulario de nuevo articulo.
- Catalogo con tarjetas.
- Vista movil.

## Funcionalidades

- Agregar comics, mangas, libros y figuras.
- Clasificar articulos como pendientes o conseguidos.
- Guardar precio, tienda, serie/linea, fecha, notas e imagen.
- Asignar prioridad: alta, media o baja.
- Registrar estado de lectura: no leido, por leer, leyendo o leido.
- Guardar paginas leidas, total de paginas, tiempo leido y porcentaje de progreso.
- Filtrar por estado y tipo de articulo.
- Buscar por titulo, serie, tienda, notas o formato.
- Ordenar por fecha, prioridad, precio o titulo.
- Cambiar entre vista de tarjetas y vista compacta de lista.
- Filtrar por estado de lectura: no leido, por leer, leyendo o leido.
- Usar modo claro u oscuro.
- Exportar e importar el catalogo en formato JSON.
- Guardar datos localmente usando `localStorage`.
- Sincronizar el catalogo entre dispositivos usando Supabase.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage
- GitHub Pages
- Supabase Auth y Database, opcional para sincronizacion en la nube
- Google Custom Search API, opcional para busqueda de imagenes

## Instalacion local

Clona el repositorio:

```bash
git clone https://github.com/3lmery42an/Collection.git
```

Entra al proyecto:

```bash
cd Collection
```

Abre `index.html` en el navegador o usa una extension como Live Server.

## Uso

1. Completa el formulario con los datos del articulo.
2. Selecciona tipo, estado, prioridad y formato.
3. Si es comic, manga o libro, agrega paginas leidas, total de paginas y tiempo leido.
4. Anade una imagen por URL, archivo local o busqueda externa.
5. Guarda el articulo.
6. Usa los filtros y la busqueda para organizar el catalogo.
7. Exporta tu catalogo como respaldo JSON.

## Backup y transferencia de datos

Los datos se guardan en el navegador donde usas la app. Si agregas articulos abriendo `index.html` localmente, esos datos no aparecen automaticamente en el sitio publico de GitHub Pages.

Para mover tus datos:

1. Abre la version donde si ves tus comics/items.
2. Presiona `Exportar`.
3. Abre el [sitio publico](https://3lmery42an.github.io/Collection/).
4. Presiona `Importar` y selecciona el archivo JSON descargado.
5. Acepta reemplazar el catalogo si quieres que quede igual.

Tambien puedes abrir `localstorage-export.html` desde el mismo origen donde estan tus datos para descargar un respaldo JSON.

## Sincronizacion con Supabase

Para ver el mismo catalogo en varios dispositivos:

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta el contenido de `supabase-schema.sql`.
4. En la app, pega tu Supabase URL y tu anon/publishable key.
5. Crea una cuenta o inicia sesion.
6. Usa `Subir local` en el dispositivo donde ya tienes tu catalogo.
7. En otros dispositivos, inicia sesion y usa `Cargar nube`.

Si `Crear cuenta` no inicia sesion automaticamente, revisa tu email y confirma la cuenta. Supabase puede requerir confirmacion antes de entregar una sesion activa. Tambien puedes desactivar la confirmacion de email desde Authentication > Providers > Email en tu proyecto de Supabase si prefieres login inmediato durante desarrollo.

La anon key de Supabase puede usarse en frontend, pero debes mantener activado Row Level Security como aparece en `supabase-schema.sql`.

## Privacidad

Los datos se guardan en el navegador mediante `localStorage`. No existe una base de datos remota. Esto significa que los datos no se sincronizan automaticamente entre dispositivos o navegadores.

Si usas una API key de Google Custom Search, configura restricciones de seguridad en Google Cloud antes de usarla.

## Limitaciones actuales

- Los datos solo existen en el navegador donde se guardaron.
- Las imagenes locales se convierten a base64 y pueden ocupar mucho espacio.
- La sincronizacion requiere configurar Supabase.
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
