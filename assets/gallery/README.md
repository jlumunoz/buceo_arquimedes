# Galería

Carpeta preparada para añadir álbumes propios de cursos y salidas.

Cada carpeta puede convertirse en un álbum. En GitHub Pages debes añadir la carpeta a `gallery.json`, porque GitHub Pages no permite listar carpetas automáticamente desde JavaScript.

Ejemplo:

- `Maldivas_2026` se muestra como `Maldivas 2026`.
- `Curso_B1E_Sevilla` se muestra como `Curso B1E Sevilla`.

Dentro de cada carpeta puedes añadir imágenes y vídeos:

```html
assets/gallery/Maldivas_2026/inmersion-01.jpg
```

Después añade el nombre del archivo a `assets/gallery/gallery.json`.

También se admiten vídeos `.mp4`, `.webm`, `.ogg`, `.mov` y `.m4v`. Puedes mezclarlos en la misma lista `media` del álbum.

Para subcarpetas de cursos puedes usar:

```html
assets/gallery/Cursos/2026-02-16/foto-01.jpg
assets/gallery/Cursos/2026-02-16/video-01.mp4
```
