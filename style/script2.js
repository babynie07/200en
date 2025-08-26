const scene = document.getElementById("scene");
const sparkleContainer = document.getElementById("sparkles");
const bgMusic = document.getElementById("sound");

    window.addEventListener("load", () => {
        const savedTime = localStorage.getItem("musicTime");
        const wasPlaying = localStorage.getItem("musicPlaying") === "true";

        if (savedTime) {
            bgMusic.currentTime = parseFloat(savedTime);
        }

        if (wasPlaying) {
            bgMusic.play().catch(() => {
                console.log("Autoplay bị chặn, sẽ phát khi user chạm màn hình");
            });
        }
    });

    // 👉 Nếu autoplay bị chặn thì phát nhạc khi user chạm/click lần đầu
    function enableMusicOnTouch() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                console.log("Phát nhạc sau khi user chạm màn hình");
            }).catch(err => console.log("Không thể phát nhạc:", err));
        }
        // Gỡ listener sau khi đã phát một lần
        document.removeEventListener("click", enableMusicOnTouch);
        document.removeEventListener("touchstart", enableMusicOnTouch);
    }

    document.addEventListener("click", enableMusicOnTouch);
    document.addEventListener("touchstart", enableMusicOnTouch);

const texts = [
  "Chúc mừng sinh nhật 🎉", 
  "Happy Birthday 🎂", 
  "28 - 08", 
  "Thanh Tuyền", 
  "Chúc Mừng Sinh Nhật Thanh Tuyền 🥳", 
  "Wishing you endless joy 💫", 
  "Luôn cười thật tươi nhé 😊", 
  "Hope all your dreams come true ✨", 
  "Yêu thương luôn bên em ❤️",
  "I Love You 3000 ❤️❤️❤️"
];

const icons = ["🎂", "🎉", "💖", "🌟", "💐", "🎁", "✨", "💝"];

function createFallingText() {
  const text = document.createElement("div");
  text.className = "falling-text";
  text.textContent = texts[Math.floor(Math.random() * texts.length)];
  text.style.left = `${Math.random() * window.innerWidth}px`;
  text.style.transform = `translateZ(${(Math.random() - 0.5) * 300}px)`;
  scene.appendChild(text);

  setTimeout(() => {
    if (text.parentElement) text.remove();
  }, 6000);
}

function createFallingIcon() {
  const icon = document.createElement("div");
  icon.className = "falling-icon";
  icon.textContent = icons[Math.floor(Math.random() * icons.length)];
  icon.style.left = `${Math.random() * window.innerWidth}px`;
  icon.style.transform = `translateZ(${(Math.random() - 0.5) * 300}px)`;
  scene.appendChild(icon);

  setTimeout(() => {
    if (icon.parentElement) icon.remove();
  }, 6000);
}

setInterval(() => {
  if (scene.childElementCount < 40) {
    createFallingText();
    createFallingIcon();
  }
}, 300);

// ==== PHÁT NHẠC ====

function tryPlayMusic() {
  audio.currentTime = 48;
  audio.play().then(() => {
    console.log("🎵 Tự động phát nhạc thành công.");
  }).catch((e) => {
    console.warn("🎵 Tự động phát nhạc bị chặn, chờ người dùng tương tác...");
    waitForUserInteraction(); // fallback nếu bị chặn
  });
}

function waitForUserInteraction() {
  const playOnce = () => {
    audio.currentTime = 48;
    audio.play().then(() => {
      console.log("🎵 Đã phát nhạc sau khi người dùng tương tác.");
    }).catch(err => {
      console.warn("Không thể phát nhạc:", err);
    });

    document.removeEventListener("click", playOnce);
    document.removeEventListener("touchstart", playOnce);
  };

  document.addEventListener("click", playOnce);
  document.addEventListener("touchstart", playOnce);
}

window.addEventListener("load", () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    tryPlayMusic(); // Thử tự động phát trên desktop
  } else {
    waitForUserInteraction(); // Luôn đợi người dùng trên thiết bị di động
  }
});

// ==== XOAY SCENE KHI KÉO ====

let isDragging = false;
let lastTouch = { x: 0, y: 0 };
let lastMove = 0;

document.addEventListener("mousedown", () => {
  isDragging = true;
  document.body.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "grab";
});

document.addEventListener("mouseleave", () => {
  isDragging = false;
  document.body.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (!isDragging || now - lastMove < 30) return;
  lastMove = now;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const rotateY = (e.clientX - centerX) * 0.15;
  const rotateX = -(e.clientY - centerY) * 0.15;
  scene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener("touchstart", (e) => {
  isDragging = true;
  lastTouch.x = e.touches[0].clientX;
  lastTouch.y = e.touches[0].clientY;
}, { passive: false });

document.addEventListener("touchend", () => {
  isDragging = false;
});

document.addEventListener("touchmove", (e) => {
  const now = Date.now();
  if (!isDragging || now - lastMove < 30) return;
  lastMove = now;

  const touch = e.touches[0];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const rotateY = (touch.clientX - centerX) * 0.15;
  const rotateX = -(touch.clientY - centerY) * 0.15;
  scene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}, { passive: false });

// ==== HIỆU ỨNG SPARKLES ====
function createSparkles(count = 40) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.top = `${Math.random() * 95}%`;
    s.style.left = `${Math.random() * 95}%`;
    s.style.animationDuration = `${3 + Math.random() * 3}s`;
    s.style.animationDelay = `${Math.random() * 4}s`;
    sparkleContainer.appendChild(s);
  }
}

createSparkles(40);
