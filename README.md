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

El calendario anual usa `localStorage`, por lo que las semanas marcadas se conservan en el navegador.

## Galería por carpetas

Cada carpeta dentro de `assets/gallery/` puede convertirse en un álbum. Para que funcione en GitHub Pages, añade el álbum y sus fotos a `assets/gallery/gallery.json`.

Ejemplo:

- `assets/gallery/Maldivas_2026/` aparece como `Maldivas 2026`.
- `assets/gallery/Salidas_La_Herradura/` aparece como `Salidas La Herradura`.

Dentro de cada carpeta se muestran las imágenes con extensión `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` o `.gif`. Al hacer clic en un álbum se abre un modal con todas sus fotos.

GitHub Pages no lista carpetas automáticamente, por eso la galería usa `gallery.json`. Si creas `assets/gallery/Maldivas_2026/`, añade algo así:

```json
{
  "folder": "Maldivas_2026",
  "photos": ["foto-01.jpg", "foto-02.jpg"]
}
```
