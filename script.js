// 1. Генерируем 50 дверей (7 рядов по 7 дверей = 49 + парадная 50-я по центру снизу)
const grid = document.getElementById("doors-grid");
for (let i = 1; i <= 50; i++) {
  const slot = document.createElement("div");
  slot.className = "door-slot";

  if (i === 50) {
    slot.classList.add("door-50");
    slot.id = "door-50-slot";
    slot.innerHTML = `
      <div class="door-leaf" id="door-50-leaf">
        <span class="door-50-number">50</span>
        <span class="door-50-sub">ЖАС</span>
      </div>
    `;
  } else {
    slot.textContent = i;
  }
  grid.appendChild(slot);
}

// 2. Вступительная анимация: плавный наезд камеры на 50-ю дверь
const introTl = gsap.timeline({ delay: 0.3 });
introTl
  .from("#mansion-wrapper", { y: 45, opacity: 0, duration: 1.1, ease: "power3.out" })
  .to("#mansion-wrapper", { scale: 2.05, duration: 1.7, ease: "power2.inOut" }, "+=0.3")
  .to(["#hint-text", "#open-door-btn"], { opacity: 1, duration: 0.6 }, "-=0.5");

// 3. Открытие 50-й двери по клику и провал внутрь пригласительного
let isOpened = false;
function openFiftyDoor() {
  if (isOpened) return;
  isOpened = true;

  const openTl = gsap.timeline();
  openTl
    .to(["#hint-text", "#open-door-btn"], { opacity: 0, duration: 0.25 })
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
    .set("#scene-container", { display: "none" })
    .set("#invitation", { display: "block" })
    .to("#invitation", {
      opacity: 1,
      duration: 0.85,
      ease: "power2.out",
      onComplete: () => {
        document.getElementById("invitation").setAttribute("aria-hidden", "false");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
}

document.getElementById("door-50-slot").addEventListener("click", openFiftyDoor);
document.getElementById("open-door-btn").addEventListener("click", openFiftyDoor);

// 4. Музыка из файла WhatsApp Audio 2026-11-27 at 16.35.57.mpeg
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

// 5. Автоформатирование телефона +7 (___) ___-__-__
const phoneInput = document.getElementById("guestPhone");
phoneInput.addEventListener("input", e => {
  let digits = e.target.value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.substring(1);
  digits = digits.substring(0, 10);

  let formatted = "+7";
  if (digits.length > 0) formatted += " (" + digits.substring(0, 3);
  if (digits.length >= 4) formatted += ") " + digits.substring(3, 6);
  if (digits.length >= 7) formatted += "-" + digits.substring(6, 8);
  if (digits.length >= 9) formatted += "-" + digits.substring(8, 10);

  e.target.value = digits.length > 0 ? formatted : "";
});

// 6. Отправка ответов формы в Google Sheets
// Вставьте сюда URL вашего развернутого веб-приложения Google Apps Script:
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/ВСТАВЬТЕ_ВАШ_ID/exec";

const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

rsvpForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!rsvpForm.reportValidity()) return;

  const data = new FormData(rsvpForm);
  const payload = {
    name: String(data.get("guestName") || "").trim(),
    phone: String(data.get("guestPhone") || "").trim(),
    attendance: String(data.get("attendance") || ""),
    wish: String(data.get("guestWish") || "").trim(),
    timestamp: new Date().toLocaleString("ru-RU")
  };

  submitBtn.disabled = true;
  formMessage.style.color = "#806b68";
  formMessage.textContent = "Жіберілуде...";

  try {
    await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    formMessage.style.color = "#47634a";
    formMessage.textContent = `Рақмет, ${payload.name}! Жауабыңыз сақталды.`;
    rsvpForm.reset();
  } catch (err) {
    formMessage.style.color = "#8a1c2e";
    formMessage.textContent = "Қате кетті. Қайта байқап көріңіз.";
  } finally {
    submitBtn.disabled = false;
  }
});

// 7. Парящие золотые частицы на Canvas
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
