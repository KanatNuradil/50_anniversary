const doorGrid = document.getElementById("doorGrid");
const palace = document.getElementById("palace");
const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const skipIntro = document.getElementById("skipIntro");
const doorCloseupStage = document.getElementById("doorCloseupStage");
const closeupPanel = document.getElementById("closeupPanel");
const closeupKnob = document.getElementById("closeupKnob");
const closeupLightBeam = document.getElementById("closeupLightBeam");
let introFinished = false;
let doorTimers = [];

function createDoors() {
  const fragment = document.createDocumentFragment();
  for (let number = 1; number <= 50; number++) {
    const door = document.createElement("div");
    door.className = "door" + (number === 50 ? " special" : "");
    door.dataset.number = String(number);
    door.setAttribute("aria-label", `${number}-есік`);
    door.innerHTML = `
      <div class="door-frame">
        <div class="door-panel"></div>
        <span class="door-number">${String(number).padStart(2, "0")}</span>
      </div>`;
    fragment.appendChild(door);
  }
  doorGrid.appendChild(fragment);
}

function wait(ms) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms);
    doorTimers.push(timer);
  });
}

async function runIntro() {
  if (introFinished) return;
  const doors = [...document.querySelectorAll(".door")];

  // Плавный спуск сцены от верха дворца вниз к 50-й двери
  const scrollTimer = setTimeout(() => {
    if (!introFinished && palace) {
      palace.classList.add("scroll-to-50");
    }
  }, 500);
  doorTimers.push(scrollTimer);

  // Постепенное проявление дверей сверху вниз
  for (let i = 0; i < doors.length; i++) {
    if (introFinished) return;
    doors[i].classList.add("visible");
    await wait(i % 5 === 4 ? 190 : 95);
  }

  if (introFinished) return;
  await wait(700);
  if (introFinished) return;

  // Крупный план 50-й двери
  if (palace) palace.classList.add("fade-out");
  if (doorCloseupStage) {
    doorCloseupStage.classList.add("active");
    doorCloseupStage.setAttribute("aria-hidden", "false");
  }

  await wait(900);
  if (introFinished) return;

  if (closeupKnob) closeupKnob.classList.add("turned");
  await wait(420);
  if (introFinished) return;

  if (closeupLightBeam) closeupLightBeam.classList.add("glow");
  if (closeupPanel) closeupPanel.classList.add("open");

  await wait(2200);
  revealInvitation();
}

function revealInvitation() {
  if (introFinished) return;
  introFinished = true;
  doorTimers.forEach(clearTimeout);
  intro.classList.add("fade-away");
  intro.style.transition = "opacity 1.1s ease, transform 1.1s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.03)";
  setTimeout(() => {
    intro.style.display = "none";
    invitation.classList.add("show");
    invitation.setAttribute("aria-hidden", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 950);
}

createDoors();
setTimeout(runIntro, 500);
skipIntro.addEventListener("click", revealInvitation);

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
