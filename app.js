const scene = document.querySelector("#scene");
const clockCard = document.querySelector(".clock-card");
const time = document.querySelector("#time");
const date = document.querySelector("#date");
const timezone = document.querySelector("#timezone");
const natureScenes = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85"
];

const drag = {
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0
};

function setNatureBackground() {
  const selectedScene = natureScenes[Math.floor(Math.random() * natureScenes.length)];
  scene.style.backgroundImage = `url("${selectedScene}")`;
}

function updateClock() {
  const now = new Date();
  time.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  date.textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  timezone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ");
}

function renderDrag() {
  const smoothing = drag.active ? 0.2 : 0.12;
  drag.x += (drag.targetX - drag.x) * smoothing;
  drag.y += (drag.targetY - drag.y) * smoothing;
  const horizontalStretch = 1 + Math.abs(drag.x) * 0.003;
  const verticalStretch = 1 + Math.abs(drag.y) * 0.003;
  const tiltX = drag.y * -0.08;
  const tiltY = drag.x * 0.08;
  const shearX = drag.x * 0.06;
  const shearY = drag.y * 0.04;

  clockCard.style.setProperty("--stretch-x", horizontalStretch.toFixed(3));
  clockCard.style.setProperty("--stretch-y", verticalStretch.toFixed(3));
  clockCard.style.setProperty("--shear-x", `${shearX.toFixed(2)}deg`);
  clockCard.style.setProperty("--shear-y", `${shearY.toFixed(2)}deg`);
  clockCard.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
  clockCard.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);

  if (drag.active || Math.abs(drag.x) > 0.05 || Math.abs(drag.y) > 0.05) {
    requestAnimationFrame(renderDrag);
  } else {
    drag.x = 0;
    drag.y = 0;
    clockCard.style.setProperty("--stretch-x", "1");
    clockCard.style.setProperty("--stretch-y", "1");
    clockCard.style.setProperty("--shear-x", "0deg");
    clockCard.style.setProperty("--shear-y", "0deg");
    clockCard.style.setProperty("--tilt-x", "0deg");
    clockCard.style.setProperty("--tilt-y", "0deg");
  }
}

clockCard.addEventListener("pointerdown", (event) => {
  drag.active = true;
  drag.pointerId = event.pointerId;
  drag.startX = event.clientX;
  drag.startY = event.clientY;
  const bounds = clockCard.getBoundingClientRect();
  clockCard.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
  clockCard.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  clockCard.classList.add("is-dragging");
  clockCard.setPointerCapture(event.pointerId);
  requestAnimationFrame(renderDrag);
});

clockCard.addEventListener("pointermove", (event) => {
  if (!drag.active || event.pointerId !== drag.pointerId) return;
  const bounds = clockCard.getBoundingClientRect();
  drag.targetX = Math.max(-40, Math.min(40, event.clientX - drag.startX));
  drag.targetY = Math.max(-28, Math.min(28, event.clientY - drag.startY));
  clockCard.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
  clockCard.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
});

function releaseDrag(event) {
  if (event.pointerId !== drag.pointerId) return;
  drag.active = false;
  drag.pointerId = null;
  drag.targetX = 0;
  drag.targetY = 0;
  clockCard.classList.remove("is-dragging");
  if (clockCard.hasPointerCapture(event.pointerId)) {
    clockCard.releasePointerCapture(event.pointerId);
  }
  requestAnimationFrame(renderDrag);
}

clockCard.addEventListener("pointerup", releaseDrag);
clockCard.addEventListener("pointercancel", releaseDrag);

setNatureBackground();
updateClock();
setInterval(updateClock, 1000);
