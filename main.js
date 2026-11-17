const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const compactLayout = window.matchMedia("(max-width: 760px)");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

document.documentElement.classList.add("enhanced");
menuButton.hidden = false;

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});

compactLayout.addEventListener("change", closeMenu);
