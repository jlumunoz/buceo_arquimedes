# Buceo Arquímedes para GitHub Pages

La web se publica como archivos estáticos. La galería se genera a partir de las carpetas del repositorio y se puede consultar sin cuenta.

## Subir y publicar

1. Crea un repositorio en GitHub con rama `main`. En GitHub Free, usa un repositorio público para publicar con Pages.
2. Sube todos los archivos de este proyecto a la raíz del repositorio. Incluye `.github/workflows/pages.yml`, que se encarga de generar y publicar la web.
3. En GitHub, ve a **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Ve a **Actions → Publicar en GitHub Pages → Run workflow** para lanzar la primera publicación si aún no ha terminado una ejecución. En la ejecución verás el enlace de la web.
5. Cada cambio que subas a `main` volverá a generar y publicar la web con las nuevas fotos.

## Añadir álbumes y fotos

Crea una subcarpeta en `gallery` por cada curso, bautismo o salida y coloca las fotos directamente dentro.

```text
gallery/
├── Curso 1 estrella - marzo/
│   ├── 01-equipo.jpg
│   └── 02-inmersion.webp
└── Salida a La Herradura/
    └── 01-desde-el-puerto.jpg
```

El nombre de la carpeta aparece como título. Las imágenes se ordenan por nombre y la primera es la portada. Se admiten JPG, JPEG, PNG, WebP, GIF y AVIF. Solo se muestran las carpetas con imágenes. Para añadir fotos a un álbum existente, súbelas a su carpeta.

Si quieres incluir fecha y tipo de actividad, añade un archivo `album.json` dentro de esa carpeta. Todos sus campos son opcionales.

```json
{
  "title": "Curso de 1 estrella en La Herradura",
  "date": "2026-03-23",
  "category": "Curso"
}
```

Los álbumes con fecha aparecen primero, del más reciente al más antiguo. Las imágenes subidas a un repositorio público de GitHub son públicas.

## Cambiar las semanas de curso

Edita `data/cursos.json`. Escribe el lunes de cada semana en formato `AAAA-MM-DD`. Se admite una semana por mes. Una semana que cruza de mes se muestra en el mes en que empieza, con la primera semana ISO del año situada en enero. Los visitantes consultan el calendario en modo solo lectura.

## Generar en local

Con Node.js 22, ejecuta `node scripts/build.mjs` desde la raíz. Se generará la carpeta `_site` con los archivos publicables. Puedes servir esa carpeta con cualquier servidor HTTP local. Por ejemplo, si tienes Python, ejecuta `python -m http.server 4173 --directory _site` y visita [la vista local](http://localhost:4173/).

## Dominio propio

Una vez publicada la web, puedes añadir un dominio en **Settings → Pages → Custom domain**. Usa los registros DNS que indique GitHub Pages cuando decidas efectuar el cambio.
