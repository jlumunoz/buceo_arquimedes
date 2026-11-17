(() => {
  const byId = (id) => document.getElementById(id);
  const albumsPanel = byId("gallery-albums");
  const galleryStatus = byId("gallery-status");
  const retry = byId("gallery-retry");
  const viewer = byId("gallery-viewer");
  const viewerTitle = byId("gallery-viewer-title");
  const viewerPhoto = byId("gallery-viewer-image");
  const viewerCount = byId("gallery-viewer-count");
  const previous = byId("gallery-previous");
  const next = byId("gallery-next");
  const dateFormat = new Intl.DateTimeFormat("es-ES", {dateStyle: "long", timeZone: "UTC"});
  let currentAlbum;
  let currentPhoto = 0;
  function showPhoto() {
    viewerTitle.textContent = currentAlbum.title;
    viewerPhoto.alt = `Foto ${currentPhoto + 1} del álbum ${currentAlbum.title}`;
    viewerPhoto.src = currentAlbum.photos[currentPhoto];
    viewerCount.textContent = `${currentPhoto + 1} de ${currentAlbum.photos.length}`;
    previous.disabled = currentPhoto === 0;
    next.disabled = currentPhoto === currentAlbum.photos.length - 1;
  }

  function openPhoto(album, index) {
    currentAlbum = album;
    currentPhoto = index;
    showPhoto();
    viewer.showModal();
  }

  function renderAlbum(album) {
    const card = document.createElement("details");
    card.className = "gallery-album";
    const summary = document.createElement("summary");
    const cover = document.createElement("img");
    cover.className = "gallery-cover";
    cover.alt = "";
    cover.loading = "lazy";
    cover.decoding = "async";
    cover.src = album.photos[0];
    const label = document.createElement("span");
    label.className = "gallery-album-label";
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.className = "gallery-album-title";
    title.textContent = album.title;
    const meta = document.createElement("span");
    meta.className = "gallery-album-meta";
    const count = album.photos.length;
    meta.textContent = [
      album.category,
      album.date ? dateFormat.format(Date.parse(album.date)) : "",
      `${count} ${count === 1 ? "foto" : "fotos"}`
    ].filter(Boolean).join(" · ");
    copy.append(title, meta);
    label.append(copy);
    summary.append(cover, label);
    card.append(summary);

    card.addEventListener("toggle", () => {
      if (!card.open || card.children.length > 1) return;
      const photos = document.createElement("div");
      photos.className = "gallery-photos";
      for (const [index, path] of album.photos.entries()) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gallery-photo";
        button.setAttribute("aria-label", `Abrir foto ${index + 1} de ${album.title}`);
        const image = document.createElement("img");
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        image.src = path;
        button.append(image);
        button.addEventListener("click", () => openPhoto(album, index));
        photos.append(button);
      }
      card.append(photos);
    });
    return card;
  }

  async function loadGallery() {
    retry.hidden = true;
    try {
      const response = await fetch("gallery/albums.json");
      if (!response.ok) throw new Error("Gallery unavailable");
      const albums = await response.json();
      albumsPanel.replaceChildren(...albums.map(renderAlbum));
      galleryStatus.textContent = albums.length ? "" : "Aún no hay álbumes publicados.";
    } catch {
      galleryStatus.textContent = "No se han podido cargar los álbumes.";
      retry.hidden = false;
    }
  }

  previous.addEventListener("click", () => { currentPhoto--; showPhoto(); });
  next.addEventListener("click", () => { currentPhoto++; showPhoto(); });
  retry.addEventListener("click", loadGallery);
  loadGallery();
})();