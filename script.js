document.addEventListener("DOMContentLoaded", function () {
  createFloatingHearts();
  initScrollAnimations();
  initSecretHeart();
  addInteractiveElements();
});

function createFloatingHearts() {
  const heartsContainer = document.querySelector(".hearts-container");
  const heartCount = 20;

  for (let i = 0; i < heartCount; i++) {
    createHeart(heartsContainer, i);
  }

  setInterval(() => {
    if (document.querySelectorAll(".heart").length < 30) {
      createHeart(heartsContainer, Math.random() * 1000);
    }
  }, 3000);
}

function createHeart(container, index) {
  const heart = document.createElement("div");
  heart.classList.add("heart");

  const left = Math.random() * 100;
  const delay = Math.random() * 10;
  const duration = 15 + Math.random() * 15;
  const size = 8 + Math.random() * 20;

  heart.style.left = `${left}vw`;
  heart.style.animation = `float ${duration}s linear infinite`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  const colors = ["#ff6b93", "#ff8fab", "#ffb3c6", "#ffcad4", "#ff4d7d"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  heart.style.color = color;

  container.appendChild(heart);
}

function initScrollAnimations() {
  const messageTexts = document.querySelectorAll(".message-text, .signature");
  const timelineContents = document.querySelectorAll(".timeline-content");
  const qualityCards = document.querySelectorAll(".quality-card");

  setTimeout(() => {
    messageTexts.forEach((text) => {
      text.classList.add("show");
    });
  }, 500);

  const scrollHandler = function () {
    messageTexts.forEach((text) => {
      const elementTop = text.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 100) {
        text.classList.add("show");
      }
    });

    timelineContents.forEach((content, index) => {
      const elementTop = content.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 100) {
        setTimeout(() => {
          content.classList.add("show");
        }, index * 200);
      }
    });

    qualityCards.forEach((card, index) => {
      const elementTop = card.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 100) {
        setTimeout(() => {
          card.classList.add("show");
        }, index * 150);
      }
    });
  };

  window.addEventListener("scroll", scrollHandler);
  scrollHandler();
}

function initSecretHeart() {
  const secretHeart = document.getElementById("secretHeart");
  const modal = document.getElementById("secretModal");
  const closeBtn = document.querySelector(".close");

  secretHeart.addEventListener("click", function () {
    modal.style.display = "block";
    createSmallHearts();
    createConfetti();
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

function createSmallHearts() {
  const container = document.querySelector(".floating-hearts-small");
  container.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.width = "12px";
    heart.style.height = "12px";
    heart.style.position = "absolute";
    heart.style.left = `${10 + i * 12}%`;
    heart.style.animation = `float 6s linear infinite`;
    heart.style.animationDelay = `${i * 0.3}s`;
    heart.style.color = "#ff6b93";

    container.appendChild(heart);
  }
}

function createConfetti() {
  const container = document.querySelector(".confetti-container");
  const colors = ["#ff6b93", "#ff8fab", "#ffb3c6", "#d23669", "#ff4d7d"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 5 + Math.random() * 10;
    const left = Math.random() * 100;
    const animationDuration = 2 + Math.random() * 3;

    confetti.style.background = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${left}vw`;
    confetti.style.animation = `floatUp ${animationDuration}s linear forwards`;
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";

    container.appendChild(confetti);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, animationDuration * 1000);
  }
}

function addInteractiveElements() {
  const socialBtns = document.querySelectorAll(".social-btn");
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      createConfetti();
      this.style.transform = "scale(1.3)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 300);
    });
  });

  setInterval(() => {
    const title = document.querySelector(".title");
    title.style.animation = "none";
    setTimeout(() => {
      title.style.animation = "gentlePulse 4s infinite";
    }, 10);
  }, 8000);

  let hue = 0;
  setInterval(() => {
    hue = (hue + 0.1) % 360;
    document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 30%, 95%) 0%, hsl(${
      hue + 30
    }, 40%, 97%) 100%)`;
  }, 5000);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "l" || e.key === "L") {
    const modal = document.getElementById("secretModal");
    modal.style.display = "block";
    createSmallHearts();
    createConfetti();
  }

  if (e.key === " ") {
    createConfetti();
  }
});

console.log(
  "%c 💖 You found the secret! This website is a love letter to someone very special. 💖",
  "color: #ff6b93; font-size: 16px; font-weight: bold;"
);
