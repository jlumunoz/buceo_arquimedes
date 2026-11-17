import {copyFile, cp, lstat, mkdir, readFile, readdir, realpath, rm, writeFile} from "node:fs/promises";
import {dirname, extname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = await realpath(fileURLToPath(new URL("../", import.meta.url)));
const output = join(root, "_site");
const formats = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const order = new Intl.Collator("es", {numeric: true, sensitivity: "base"});
const day = 86_400_000;

function isoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

async function loadCourseDates() {
  const dates = JSON.parse(await readFile(join(root, "data", "cursos.json"), "utf8"));
  if (!Array.isArray(dates)) throw new Error("data/cursos.json debe contener una lista de fechas.");
  const months = new Set();
  for (const value of dates) {
    const date = isoDate(value);
    if (date?.getUTCDay() !== 1) throw new Error(`La fecha ${value} debe ser un lunes con formato AAAA-MM-DD.`);
    const year = new Date(date.getTime() + 3 * day).getUTCFullYear();
    const month = date.getUTCFullYear() < year ? 0 : date.getUTCMonth();
    if (year < 1900 || year > 9998) throw new Error(`Año fuera del intervalo admitido: ${value}.`);
    const monthKey = `${year}-${month + 1}`;
    if (months.has(monthKey)) throw new Error(`Solo puede programarse una semana por mes (${monthKey}).`);
    months.add(monthKey);
  }
  return dates.sort();
}

async function albumMetadata(directory, name, metadataFile) {
  const title = name.split("/").at(-1).replaceAll("_", " ");
  if (!metadataFile) return {title};
  const data = JSON.parse(await readFile(join(directory, "album.json"), "utf8"));
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`gallery/${name}/album.json debe contener un objeto JSON.`);
  }
  for (const field of ["title", "category"]) {
    if (data[field] !== undefined && (typeof data[field] !== "string" || !data[field].trim())) {
      throw new Error(`El campo ${field} del álbum ${name} debe ser un texto.`);
    }
  }
  if (data.date !== undefined && !isoDate(data.date)) throw new Error(`La fecha del álbum ${name} debe tener formato AAAA-MM-DD.`);
  return {title: data.title?.trim() || title, date: data.date, category: data.category?.trim()};
}

async function collectAlbums(directory, segments = []) {
  const files = await readdir(directory, {withFileTypes: true});
  const albums = [];
  const photoNames = files.filter((file) => file.isFile() && !file.name.startsWith(".") && formats.has(extname(file.name).toLowerCase()))
    .map((file) => file.name)
    .sort((a, b) => order.compare(a, b) || a.localeCompare(b));
  if (segments.length && photoNames.length) {
    const metadata = await albumMetadata(directory, segments.join("/"), files.some((file) => file.isFile() && file.name === "album.json"));
    albums.push({segments, directory, photoNames, metadata});
  }
  for (const folder of files) {
    if (folder.isDirectory() && !folder.name.startsWith(".")) {
      albums.push(...await collectAlbums(join(directory, folder.name), [...segments, folder.name]));
    }
  }
  return albums;
}

const [courses, albums] = await Promise.all([loadCourseDates(), collectAlbums(join(root, "gallery"))]);
albums.sort((a, b) => (b.metadata.date || "").localeCompare(a.metadata.date || "") ||
  order.compare(a.metadata.title, b.metadata.title) || order.compare(a.segments.join("/"), b.segments.join("/")));
const previous = await lstat(output).catch((error) => {
  if (error.code !== "ENOENT") throw error;
  return null;
});
if (previous) {
  if (!previous.isDirectory() || previous.isSymbolicLink() || dirname(await realpath(output)) !== root) {
    throw new Error("La ruta _site debe ser una carpeta de este proyecto.");
  }
  await rm(output, {recursive: true});
}

await mkdir(join(output, "data"), {recursive: true});
await mkdir(join(output, "gallery"), {recursive: true});
const pages = ["index.html", "styles.css", "main.js", "calendar-weeks.js", "calendario.js", "galeria.js"];
await Promise.all([
  ...pages.map((file) => copyFile(join(root, file), join(output, file))),
  cp(join(root, "assets"), join(output, "assets"), {recursive: true})
]);

const manifest = [];
for (const {segments, directory, photoNames, metadata} of albums) {
  const destination = join(output, "gallery", ...segments);
  await mkdir(destination, {recursive: true});
  for (const name of photoNames) await copyFile(join(directory, name), join(destination, name));
  const photos = photoNames.map((name) => ["gallery", ...segments.map(encodeURIComponent), encodeURIComponent(name)].join("/"));
  manifest.push({...metadata, photos});
}
const dataFiles = [
  ["gallery/albums.js", "arquimedesAlbums", manifest],
  ["data/cursos.js", "arquimedesCourseDates", courses]
];
for (const [file, key, data] of dataFiles) {
  const script = `// Generado por scripts/build.mjs.\nglobalThis.${key} = ${JSON.stringify(data, null, 2)};\n`;
  await Promise.all([writeFile(join(root, file), script), writeFile(join(output, file), script)]);
}
console.log(`Web generada en _site · ${manifest.length} álbumes · ${courses.length} semanas de curso`);
