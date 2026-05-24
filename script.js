const annualCalendar = document.querySelector("#annualCalendar");
const yearLabel = document.querySelector("#yearLabel");
const yearSummary = document.querySelector("#yearSummary");
const prevYearButton = document.querySelector("#prevYear");
const nextYearButton = document.querySelector("#nextYear");
const albumGrid = document.querySelector("#albumGrid");
const galleryModal = document.querySelector("#galleryModal");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalClose = document.querySelector("#modalClose");
const modalTitle = document.querySelector("#modalTitle");
const modalMeta = document.querySelector("#modalMeta");
const modalFeatureImage = document.querySelector("#modalFeatureImage");
const modalFeatureCaption = document.querySelector("#modalFeatureCaption");
const modalThumbs = document.querySelector("#modalThumbs");

const GALLERY_ROOT = "assets/gallery/";
const GALLERY_MANIFEST = `${GALLERY_ROOT}gallery.json`;
const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp)$/i;
const BASE_YEAR = 2026;
const DEFAULT_COURSE_WEEKS = {
  "2026-02": "2026-02-16",
  "2026-03": "2026-03-09",
  "2026-04": "2026-04-13",
  "2026-05": "2026-05-18",
  "2026-06": "2026-06-15",
  "2026-07": "2026-07-06",
  "2026-09": "2026-09-14",
  "2026-10": "2026-10-19",
  "2026-11": "2026-11-09",
};

const formatterMonth = new Intl.DateTimeFormat("es-ES", {
  month: "long",
  year: "numeric",
});

const formatterMonthName = new Intl.DateTimeFormat("es-ES", {
  month: "long",
});

const formatterLongDate = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
});

const today = startOfDay(new Date());
let selectedYear = BASE_YEAR;
const courseWeeks = { ...DEFAULT_COURSE_WEEKS };
let galleryAlbums = [];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toIsoDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function fromIsoDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getMonday(date) {
  const day = date.getDay() || 7;
  return addDays(startOfDay(date), 1 - day);
}

function getCalendarStart(date) {
  return getMonday(new Date(date.getFullYear(), date.getMonth(), 1));
}

function isSameDay(first, second) {
  return toIsoDate(first) === toIsoDate(second);
}

function isSameWeek(date, weekStart) {
  const dateWeekStart = getMonday(date);
  return isSameDay(dateWeekStart, weekStart);
}

function formatWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 6);
  return `${formatterLongDate.format(weekStart)} - ${formatterLongDate.format(weekEnd)}`;
}

function capitalizeFirst(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderAnnualCalendar() {
  const yearEntries = Object.entries(courseWeeks).filter(([monthKey]) =>
    monthKey.startsWith(`${selectedYear}-`)
  );

  yearLabel.textContent = selectedYear;
  yearSummary.textContent = yearEntries.length
    ? `${yearEntries.length} meses con curso marcado`
    : "Sin cursos marcados este año";

  annualCalendar.innerHTML = "";

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    annualCalendar.append(createMonthCard(monthIndex));
  }
}

function createMonthCard(monthIndex) {
  const monthDate = new Date(selectedYear, monthIndex, 1);
  const monthKey = getMonthKey(monthDate);
  const selectedWeek = courseWeeks[monthKey] ? fromIsoDate(courseWeeks[monthKey]) : null;
  const monthCard = document.createElement("article");
  monthCard.className = "month-card";

  const header = document.createElement("div");
  header.className = "month-header";

  const title = document.createElement("h3");
  title.textContent = capitalizeFirst(formatterMonthName.format(monthDate));

  const status = document.createElement("p");
  status.className = selectedWeek ? "month-status" : "month-status empty";
  status.textContent = selectedWeek ? `Semana del ${selectedWeek.getDate()}` : "Sin curso";

  header.append(title, status);

  const weekdays = document.createElement("div");
  weekdays.className = "weekday-row compact";
  weekdays.setAttribute("aria-hidden", "true");
  ["L", "M", "X", "J", "V", "S", "D"].forEach((day) => {
    const item = document.createElement("span");
    item.textContent = day;
    weekdays.append(item);
  });

  const grid = document.createElement("div");
  grid.className = "month-grid";
  const calendarStart = getCalendarStart(monthDate);

  for (let index = 0; index < 42; index += 1) {
    const date = addDays(calendarStart, index);
    const day = document.createElement("span");
    day.className = "month-day";
    day.textContent = date.getDate();
    day.setAttribute(
      "aria-label",
      `${date.getDate()} de ${formatterMonth.format(date)}`
    );

    if (date.getMonth() !== monthIndex) {
      day.classList.add("outside");
    }

    if (isSameDay(date, today)) {
      day.classList.add("today");
    }

    if (selectedWeek && isSameWeek(date, selectedWeek)) {
      day.classList.add("selected-week");
      if (isSameDay(date, selectedWeek)) {
        day.classList.add("week-start");
      }
      day.setAttribute("aria-current", "date");
    }

    grid.append(day);
  }

  const footer = document.createElement("div");
  footer.className = "month-footer";

  const range = document.createElement("span");
  range.textContent = selectedWeek ? formatWeekRange(selectedWeek) : "No hay curso este mes";

  footer.append(range);
  monthCard.append(header, weekdays, grid, footer);
  return monthCard;
}

prevYearButton.addEventListener("click", () => {
  selectedYear -= 1;
  renderAnnualCalendar();
});

nextYearButton.addEventListener("click", () => {
  selectedYear += 1;
  renderAnnualCalendar();
});

function encodePathSegment(segment) {
  return segment.split("/").map(encodeURIComponent).join("/");
}

function albumFolderUrl(folder) {
  return `${GALLERY_ROOT}${encodePathSegment(folder)}/`;
}

function imageUrl(folder, fileName) {
  return `${albumFolderUrl(folder)}${encodePathSegment(fileName)}`;
}

function parseDirectoryLinks(html) {
  const documentFragment = new DOMParser().parseFromString(html, "text/html");
  return Array.from(documentFragment.querySelectorAll("a"))
    .map((link) => link.getAttribute("href") || "")
    .map((href) => decodeURIComponent(href.split(/[?#]/)[0]))
    .filter((href) => href && href !== "../" && href !== "/")
    .filter((href) => !href.startsWith("http") && !href.startsWith("/"));
}

function formatAlbumTitle(folderName) {
  return folderName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function formatPhotoCaption(fileName, index) {
  const name = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return name ? capitalizeFirst(name) : `Foto ${index + 1}`;
}

async function fetchDirectory(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`No se pudo leer ${path}`);
  }
  return response.text();
}

async function discoverAlbumPhotos(folderName) {
  const html = await fetchDirectory(albumFolderUrl(folderName));
  return parseDirectoryLinks(html)
    .filter((href) => !href.endsWith("/"))
    .filter((href) => IMAGE_EXTENSIONS.test(href))
    .map((fileName, index) => ({
      caption: formatPhotoCaption(fileName, index),
      fileName,
      src: imageUrl(folderName, fileName),
    }));
}

async function loadGalleryManifest() {
  const response = await fetch(GALLERY_MANIFEST, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`No se pudo leer ${GALLERY_MANIFEST}`);
  }

  const albums = await response.json();

  return albums
    .map((album) => {
      const folderName = album.folder || album.folderName;
      const photos = Array.isArray(album.photos) ? album.photos : [];

      if (!folderName) {
        return {
          folderName: "",
          photos: [],
          title: "",
        };
      }

      return {
        folderName,
        photos: photos
          .filter((fileName) => IMAGE_EXTENSIONS.test(fileName))
          .map((fileName, index) => ({
            caption: formatPhotoCaption(fileName, index),
            fileName,
            src: imageUrl(folderName, fileName),
          })),
        title: album.title || formatAlbumTitle(folderName || ""),
      };
    })
    .filter((album) => album.folderName && album.photos.length > 0);
}

async function discoverGalleryAlbums() {
  try {
    return await loadGalleryManifest();
  } catch {
  }

  const html = await fetchDirectory(GALLERY_ROOT);
  const folders = parseDirectoryLinks(html)
    .filter((href) => href.endsWith("/"))
    .map((href) => href.replace(/\/$/, ""))
    .filter((folderName) => folderName && !folderName.startsWith("."));

  const albums = await Promise.all(
    folders.map(async (folderName) => {
      const photos = await discoverAlbumPhotos(folderName);
      return {
        folderName,
        photos,
        title: formatAlbumTitle(folderName),
      };
    })
  );

  return albums.filter((album) => album.photos.length > 0);
}

function renderAlbumGrid() {
  albumGrid.innerHTML = "";

  if (!galleryAlbums.length) {
    const empty = document.createElement("div");
    empty.className = "album-empty";
    empty.innerHTML =
      "<strong>No hay álbumes todavía.</strong><span>Crea una carpeta dentro de assets/gallery y añade imágenes jpg, png, webp, avif o gif.</span>";
    albumGrid.append(empty);
    return;
  }

  galleryAlbums.forEach((album, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === 0 ? "album-card featured" : "album-card";
    button.setAttribute("aria-label", `Abrir álbum ${album.title}`);
    button.addEventListener("click", () => openAlbum(index));

    const image = document.createElement("img");
    image.src = album.photos[0].src;
    image.alt = `Portada de ${album.title}`;

    const overlay = document.createElement("span");
    overlay.className = "album-overlay";

    const meta = document.createElement("span");
    meta.className = "album-meta";
    meta.textContent = `${album.photos.length} ${album.photos.length === 1 ? "foto" : "fotos"}`;

    const title = document.createElement("strong");
    title.textContent = album.title;

    const action = document.createElement("span");
    action.className = "album-action";
    action.textContent = "Ver álbum";

    overlay.append(meta, title, action);
    button.append(image, overlay);
    albumGrid.append(button);
  });
}

async function loadGallery() {
  albumGrid.innerHTML = "<div class=\"album-empty\"><strong>Cargando álbumes...</strong><span>Buscando carpetas en assets/gallery.</span></div>";

  try {
    galleryAlbums = await discoverGalleryAlbums();
    renderAlbumGrid();
  } catch {
    albumGrid.innerHTML =
      "<div class=\"album-empty\"><strong>No se pudo leer la galería.</strong><span>Abre la web desde el servidor local para que el navegador pueda listar carpetas.</span></div>";
  }
}

function setFeaturedPhoto(photo) {
  modalFeatureImage.src = photo.src;
  modalFeatureImage.alt = photo.caption;
  modalFeatureCaption.textContent = photo.caption;

  Array.from(modalThumbs.querySelectorAll(".modal-thumb")).forEach((thumb) => {
    thumb.classList.toggle("active", thumb.dataset.src === photo.src);
  });
}

function openAlbum(index) {
  const album = galleryAlbums[index];
  if (!album) {
    return;
  }

  modalTitle.textContent = album.title;
  modalMeta.textContent = `${album.photos.length} ${album.photos.length === 1 ? "foto" : "fotos"} en ${album.folderName}`;
  modalThumbs.innerHTML = "";

  album.photos.forEach((photo) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "modal-thumb";
    thumb.dataset.src = photo.src;
    thumb.setAttribute("aria-label", `Ver ${photo.caption}`);
    thumb.addEventListener("click", () => setFeaturedPhoto(photo));

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.caption;

    thumb.append(image);
    modalThumbs.append(thumb);
  });

  setFeaturedPhoto(album.photos[0]);
  galleryModal.hidden = false;
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeAlbum() {
  galleryModal.hidden = true;
  document.body.classList.remove("modal-open");
  modalFeatureImage.removeAttribute("src");
}

modalBackdrop.addEventListener("click", closeAlbum);
modalClose.addEventListener("click", closeAlbum);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !galleryModal.hidden) {
    closeAlbum();
  }
});

renderAnnualCalendar();
loadGallery();
