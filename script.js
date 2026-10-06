const root = document.documentElement;
root.classList.add("has-js");

const intro = document.querySelector("#intro");
const skipIntro = document.querySelector("#skip-intro");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let introClosed = false;

function closeIntro() {
  if (introClosed) return;
  introClosed = true;
  root.classList.add("is-loaded");
  intro.classList.add("is-leaving");
  window.setTimeout(() => intro.remove(), reduceMotion ? 80 : 950);
}

skipIntro.addEventListener("click", closeIntro);
window.setTimeout(closeIntro, reduceMotion ? 20 : 2050);

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.querySelector(".sr-only").textContent = open ? "Fechar menu" : "Abrir menu";
  nav.classList.toggle("is-open", open);
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const header = document.querySelector(".site-header");
const progressBar = document.querySelector("#scroll-progress");
let scrollTicking = false;

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 28);
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollState);
  }
}, { passive: true });
updateScrollState();

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-revealed"));
}

const sectionIds = ["inicio", "essencia", "treinos", "comunidade"];
const navLinks = [...document.querySelectorAll(".nav__link")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { threshold: [0.18, 0.45, 0.7], rootMargin: "-22% 0px -48% 0px" });
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");
const closeLightbox = lightbox.querySelector(".lightbox__close");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.dataset.alt || "";
    lightboxCaption.textContent = button.dataset.alt || "";
    lightbox.showModal();
  });
});
closeLightbox.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelector("#year").textContent = new Date().getFullYear();
