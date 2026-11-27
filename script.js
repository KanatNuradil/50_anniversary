const doorGrid = document.getElementById("doorGrid");
const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const introHint = document.getElementById("introHint");
const skipIntro = document.getElementById("skipIntro");
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
  for (let i = 0; i < doors.length; i++) {
    if (introFinished) return;
    doors[i].classList.add("visible");
    // Бір қатардағы есіктер бірінен соң бірі, қатарлар аздап кідіріспен көрінеді.
    await wait(i % 5 === 4 ? 105 : 55);
  }
  if (introFinished) return;
  introHint.textContent = "Алтыншы емес — дәл 50-нөмірлі есік!";
  await wait(850);
  if (introFinished) return;
  const lastDoor = document.querySelector('.door[data-number="50"]');
  lastDoor.classList.add("opening");
  await wait(1900);
  revealInvitation();
}

function revealInvitation() {
  if (introFinished) return;
  introFinished = true;
  doorTimers.forEach(clearTimeout);
  intro.classList.add("fade-away");
  intro.style.transition = "opacity 1s ease, transform 1s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.025)";
  setTimeout(() => {
    intro.style.display = "none";
    invitation.classList.add("show");
    invitation.setAttribute("aria-hidden", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 850);
}
createDoors();
setTimeout(runIntro, 450);
skipIntro.addEventListener("click", revealInvitation);

// Әкеңіздің бала кездегі суретін таңдап, бірден алдын ала көру.
const photoUpload = document.getElementById("photoUpload");
const fatherPhoto = document.getElementById("fatherPhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");
let photoObjectUrl = null;
photoUpload.addEventListener("change", event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Сурет файлын таңдаңыз.");
    return;
  }
  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = URL.createObjectURL(file);
  fatherPhoto.src = photoObjectUrl;
  fatherPhoto.hidden = false;
  photoPlaceholder.hidden = true;
});

// Музыканы қолданушы өзі жүктейді. Браузер autoplay шектеулеріне байланысты,
// дыбыс тек батырманы басқаннан кейін қосылады.
const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
let audioObjectUrl = null;
let audioReady = false;

const musicUpload = document.createElement("input");
musicUpload.type = "file";
musicUpload.accept = "audio/*";
musicUpload.hidden = true;
document.body.appendChild(musicUpload);

musicToggle.addEventListener("click", async () => {
  if (!audioReady) {
    musicUpload.click();
    return;
  }
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

musicUpload.addEventListener("change", async event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("audio/")) {
    alert("Аудио файл таңдаңыз (MP3, WAV және т.б.).");
    return;
  }
  if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
  audioObjectUrl = URL.createObjectURL(file);
  audio.src = audioObjectUrl;
  audioReady = true;
  try {
    await audio.play();
    musicToggle.classList.add("playing");
    musicToggle.querySelector(".music-label").textContent = "Тоқтату";
  } catch (error) {
    musicToggle.querySelector(".music-label").textContent = "Қосу";
  }
});

// RSVP формасының демонстрациялық әрекеті. Деректер серверге жіберілмейді.
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

// Жеңіл алтын шаң бөлшектері.
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
