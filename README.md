# Buceo Arquímedes Web

Proyecto web estático para una escuela de buceo de Sevilla llamada **Buceo Arquímedes**.

## Archivos

- `index.html`: estructura de la página.
- `styles.css`: diseño responsive.
- `script.js`: calendario anual y galería dinámica por carpetas.
- `assets/gallery/`: carpeta preparada para álbumes de cursos y salidas.

## Cómo verlo

Abre `index.html` en el navegador. No necesita instalar dependencias.

## Fuentes usadas

El contenido se ha resumido desde la web oficial:

- https://www.buceoarquimedes.com/inicio
- https://www.buceoarquimedes.com/cursos
- https://www.buceoarquimedes.com/contacto

Las imágenes de apoyo proceden de Unsplash y usan su licencia gratuita.

El calendario anual es de solo lectura. Las semanas de curso se cambian por codigo en `DEFAULT_COURSE_WEEKS`, dentro de `script.js`.

## Galería por carpetas

Cada carpeta dentro de `assets/gallery/` puede convertirse en un álbum. Para que funcione en GitHub Pages, añade el álbum y sus archivos a `assets/gallery/gallery.json`.

Ejemplo:

- `assets/gallery/Maldivas_2026/` aparece como `Maldivas 2026`.
- `assets/gallery/Salidas_La_Herradura/` aparece como `Salidas La Herradura`.

Dentro de cada carpeta se muestran imágenes y vídeos. Formatos soportados: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.mp4`, `.webm`, `.ogg`, `.mov` y `.m4v`. Al hacer clic en un álbum se abre un modal con flechas para moverse entre archivos.

GitHub Pages no lista carpetas automáticamente, por eso la galería usa `gallery.json`. Si creas `assets/gallery/Maldivas_2026/`, añade algo así:

```json
{
  "folder": "Maldivas_2026",
  "media": ["foto-01.jpg", "video-01.mp4"]
}
```

También puedes crear subcarpetas, por ejemplo `assets/gallery/Cursos/2026-02-16/`:

```json
{
  "title": "Cursos",
  "folder": "Cursos",
  "albums": [
    {
      "title": "B1E 16 Febrero 2026",
      "folder": "2026-02-16",
      "media": ["foto-01.jpg", "video-01.mp4"]
    }
  ]
}
```
