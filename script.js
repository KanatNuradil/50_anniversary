const grid = document.getElementById("doors-grid");
const door50Slot = document.getElementById("door-50-slot");
const openDoorBtn = document.getElementById("open-door-btn");
const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");

// 1. Создаем 49 дверей сверху и 50-ю парадную дверь внизу по центру
for (let i = 1; i <= 49; i++) {
  const door = document.createElement("div");
  door.className = "door";
  door.setAttribute("aria-label", `${i}-есік`);
  door.innerHTML = `
    <div class="door-frame">
      <div class="door-inner-glimpse"><span>50 ЖАС</span></div>
      <div class="door-panel"></div>
      <span class="door-number">${String(i).padStart(2, "0")}</span>
    </div>`;
  grid.appendChild(door);
}

const door50 = document.createElement("div");
door50.className = "door special";
door50.id = "door-50-slot-card";
door50.setAttribute("aria-label", "50-есік");
door50.innerHTML = `
  <div class="door-frame">
    <div class="door-inner-glimpse">
      <span>МЕЙІРБЕК</span>
      <span>50 ЖАС</span>
    </div>
    <div class="door-panel" id="door-50-leaf"></div>
    <span class="door-number">50</span>
  </div>`;
door50Slot.appendChild(door50);

// 2. Вступительная анимация: появление дворца и плавный наезд на 50-ю дверь
let isOpened = false;
const introTl = gsap.timeline({ delay: 0.25 });
introTl
  .from("#mansion-wrapper", { y: 45, opacity: 0, duration: 1.1, ease: "power3.out" })
  .from(".door", { opacity: 0, y: 10, duration: 0.45, stagger: { amount: 0.9, from: "start" }, ease: "power2.out" }, "-=0.65")
  .to("#mansion-wrapper", { scale: 2.05, duration: 1.7, ease: "power2.inOut" }, "+=0.25")
  .to("#open-door-btn", { opacity: 1, duration: 0.5 }, "-=0.45");

// 3. Открытие 50-й двери и провал камеры внутрь пригласительного
function openFiftyDoor() {
  if (isOpened) return;
  isOpened = true;
  introTl.kill();

  const openTl = gsap.timeline();
  openTl
    .to("#open-door-btn", { opacity: 0, duration: 0.25 })
    .to("#door-50-leaf", {
      rotationY: -115,
      duration: 1.15,
      ease: "power2.inOut"
    })
    .to("#mansion-wrapper", {
      scale: 16,
      opacity: 0,
      duration: 1.25,
      ease: "power3.in"
    }, "-=0.45")
    .set("#intro", { display: "none" })
    .set("#invitation", { display: "block" })
    .to("#invitation", {
      opacity: 1,
      duration: 0.85,
      ease: "power2.out",
      onComplete: () => {
        invitation.setAttribute("aria-hidden", "false");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
}

openDoorBtn.addEventListener("click", openFiftyDoor);

// Музыка из файла WhatsApp Audio 2026-11-27 at 16.35.57.mpeg в папке проекта
const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

musicToggle.addEventListener("click", async () => {
  if (!audio) return;
  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.classList.add("playing");
      musicToggle.querySelector(".music-label").textContent = "Тоқтату";
    } catch (error) {
      musicToggle.querySelector(".music-label").textContent = "Қайта қосу";
    }
  } else {
    audio.pause();
    musicToggle.classList.remove("playing");
    musicToggle.querySelector(".music-label").textContent = "Музыка";
  }
});

// RSVP формасының демонстрациялық әрекеті
const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");
rsvpForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!rsvpForm.reportValidity()) return;
  const data = new FormData(rsvpForm);
  const guest = String(data.get("guestName") || "").trim();
  const attendance = data.get("attendance");
  formMessage.textContent = `Рақмет, ${guest}! Жауабыңыз: ${attendance}`;
  rsvpForm.reset();
});

// Жеңіл алтын шаң бөлшектері
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.min(65, Math.floor(window.innerWidth / 12)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + .35,
    speed: Math.random() * .32 + .08,
    alpha: Math.random() * .5 + .15,
    drift: (Math.random() - .5) * .22
  }));
}
function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) {
    p.y -= p.speed;
    p.x += p.drift;
    if (p.y < -5) { p.y = window.innerHeight + 5; p.x = Math.random() * window.innerWidth; }
    if (p.x < -5) p.x = window.innerWidth + 5;
    if (p.x > window.innerWidth + 5) p.x = -5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 195, 124, ${p.alpha})`;
    ctx.shadowBlur = 7;
    ctx.shadowColor = "rgba(230,195,124,.7)";
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
animateParticles();
