// Projects are mock data for the class project.
const projects = [
  { title: "Abihilan Connect", cat: "web", label: "Web", bg: "linear-gradient(150deg,#e02b2f,#3b0a0c)", text: "A community website for Barangay Abihilan with announcements, an events calendar and an online request form for barangay documents.", tags: ["HTML", "CSS", "JavaScript", "PHP"] },
  { title: "Candijay Fiesta Pubmats", cat: "design", label: "Design", bg: "linear-gradient(150deg,#f59e0b,#7c2d12)", text: "A full set of posters, social media cards and banners for the town fiesta, built on one bold visual system.", tags: ["Photoshop", "Canva", "Branding"] },
  { title: "Bohol in 60 Seconds", cat: "video", label: "Video", bg: "linear-gradient(150deg,#0ea5e9,#0c1a3a)", text: "A one-minute travel edit of Bohol's beaches and hills with speed ramps, motion text and a cinematic color grade.", tags: ["Premiere Pro", "CapCut", "Color"] },
  { title: "Tindahan POS", cat: "web", label: "Web", bg: "linear-gradient(150deg,#22c55e,#052e16)", text: "A point-of-sale and inventory system for a sari-sari store with daily sales, low-stock alerts and credit (utang) tracking.", tags: ["PHP", "MySQL", "Bootstrap"] },
  { title: "Kape Abihilan Brand", cat: "design", label: "Design", bg: "linear-gradient(150deg,#a16207,#1c1007)", text: "Logo, cups, menu board and an Instagram kit for a small roadside coffee stand.", tags: ["Logo", "Packaging", "Figma"] },
  { title: "ClassTrack App", cat: "mobile", label: "Mobile", bg: "linear-gradient(150deg,#8b5cf6,#1e0b3b)", text: "An Android app for tracking subjects, deadlines and group tasks, with reminders before each due date.", tags: ["Java", "Android Studio", "SQLite"] },
  { title: "BSCS Night Highlights", cat: "video", label: "Video", bg: "linear-gradient(150deg,#ef4444,#111)", text: "Event highlight reel for the department night: multi-cam cuts, beat-synced transitions and lower-thirds.", tags: ["Premiere Pro", "Motion", "Audio"] },
  { title: "Portfolio UI Kit", cat: "design", label: "Design", bg: "linear-gradient(150deg,#e02b2f,#111 70%)", text: "A reusable Figma UI kit — type scale, components and dark/red theme — used to design this very site.", tags: ["Figma", "UI", "Design System"] },
  { title: "BarangayQ", cat: "web", label: "Web", bg: "linear-gradient(150deg,#14b8a6,#042f2e)", text: "A queue system for the health center: patients get a number on their phone and see when it's their turn.", tags: ["JavaScript", "PHP", "MySQL"] },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

// intro curtain → start the hero animation
$$(".hero-word span").forEach((s, i) => s.style.setProperty("--i", i));
setTimeout(() => {
  $("#intro").classList.add("done");
  document.body.classList.add("ready");
}, still ? 0 : 1500);

// nav: background on scroll, active link, side dots
const nav = $("#nav");
const sections = $$("main section[id]");
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 30);
  let current = "home";
  sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
  $$(".links a").forEach((a) => a.classList.toggle("active", a.hash === "#" + current));
  $$(".side-dots a").forEach((a) => a.classList.toggle("on", a.dataset.dot === current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menu = $("#menu"), links = $("#links");
menu.addEventListener("click", () => menu.setAttribute("aria-expanded", links.classList.toggle("open")));
links.addEventListener("click", (e) => { if (e.target.tagName === "A") links.classList.remove("open"); });

// work grid + filter
const grid = $("#grid");
function render(filter) {
  grid.innerHTML = "";
  projects
    .filter((p) => filter === "all" || p.cat === filter)
    .forEach((p, i) => {
      const card = document.createElement("button");
      card.className = "card";
      card.style.setProperty("--d", `${i * 0.07}s`);
      card.innerHTML = `
        <span class="thumb" style="background:${p.bg}"><b>${p.title}</b></span>
        <span class="view" aria-hidden="true">↗</span>
        <span class="meta"><small>${p.label}</small><h3>${p.title}</h3></span>`;
      card.addEventListener("click", () => openModal(p));
      grid.append(card);
    });
}
$$(".filters button").forEach((b) => b.addEventListener("click", () => {
  $$(".filters button").forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
  render(b.dataset.filter);
}));
render("all");

// project modal
const modal = $("#modal");
function openModal(p) {
  $("#modalThumb").style.background = p.bg;
  $("#modalThumb").innerHTML = `<b>${p.title}</b>`;
  $("#modalCat").textContent = p.label;
  $("#modalTitle").textContent = p.title;
  $("#modalText").textContent = p.text;
  $("#modalTags").innerHTML = p.tags.map((t) => `<span>${t}</span>`).join("");
  modal.hidden = false;
  $("#modalClose").focus();
}
const closeModal = () => { modal.hidden = true; };
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

// reveal on scroll + count-up stats
function countUp(el) {
  const to = +el.dataset.count, plus = el.hasAttribute("data-plus") ? "+" : "", t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(to * (1 - (1 - p) ** 3)) + plus;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  $$("[data-count]", e.target).forEach((n) => (still ? (n.textContent = n.dataset.count + (n.hasAttribute("data-plus") ? "+" : "")) : countUp(n)));
  io.unobserve(e.target);
}), { threshold: 0.15 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.08}s`; io.observe(el); });

if (!still) {
  // hero parallax: the big word and the photo drift against the mouse
  const word = $("#heroWord"), photo = $("#heroPhoto");
  $(".hero").addEventListener("mousemove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    word.style.translate = `${x * -30}px ${y * -16}px`;
    photo.style.translate = `${x * 18}px ${y * 8}px`;
  });

  // magnetic button
  $$(".magnetic").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });
}
