const monthName = new Intl.DateTimeFormat("es-ES", {month: "long", timeZone: "UTC"});
const shortDate = new Intl.DateTimeFormat("es-ES", {day: "numeric", month: "short", timeZone: "UTC"});
const months = document.querySelector("#calendar-months");
const yearLabel = document.querySelector("#calendar-year");
const status = document.querySelector("#calendar-status");
const previous = document.querySelector("#calendar-prev");
const next = document.querySelector("#calendar-next");
const retry = document.querySelector("#calendar-retry");
let year = Number(new Intl.DateTimeFormat("en", {year: "numeric", timeZone: "Europe/Madrid"}).format(new Date()));
let activeLoad;

function updateYearControls() {
  previous.disabled = year === minimumYear;
  next.disabled = year === maximumYear;
}

function renderYear(courseDates) {
  const marked = new Set(courseDates);
  const cards = groupCourseWeeks(year).map((options, index) => {
    const card = document.createElement("section");
    card.className = "calendar-month";
    const heading = document.createElement("h3");
    heading.textContent = monthName.format(Date.UTC(year, index, 1));
    const selected = options.find(({monday}) => marked.has(new Date(monday).toISOString().slice(0, 10)));
    if (selected) card.classList.add("has-course");

    const dates = document.createElement("p");
    dates.className = "calendar-dates";
    dates.textContent = selected ? shortDate.formatRange(selected.monday, selected.sunday) : "Sin curso programado";
    card.append(heading, dates);
    return card;
  });
  months.replaceChildren(...cards);
}

async function loadYear() {
  activeLoad?.abort();
  const load = new AbortController();
  activeLoad = load;
  yearLabel.textContent = year;
  updateYearControls();
  months.replaceChildren();
  months.setAttribute("aria-busy", "true");
  retry.hidden = true;
  status.textContent = "Cargando calendario…";

  try {
    const response = await fetch("data/cursos.json", {signal: load.signal});
    if (!response.ok) throw new Error("Calendar unavailable");
    const courseDates = await response.json();
    if (load.signal.aborted) return;
    renderYear(courseDates);
    status.textContent = "";
  } catch {
    if (load.signal.aborted) return;
    retry.hidden = false;
    status.textContent = "No se ha podido cargar el calendario.";
  } finally {
    if (!load.signal.aborted) months.setAttribute("aria-busy", "false");
  }
}

previous.addEventListener("click", () => { year--; loadYear(); });
next.addEventListener("click", () => { year++; loadYear(); });
retry.addEventListener("click", loadYear);
loadYear();
