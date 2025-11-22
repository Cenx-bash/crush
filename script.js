// YouTube Music Player
let youtubePlayer;
let isYouTubeReady = false;
let progressInterval;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Create floating hearts background
  createFloatingHearts();

  // Initialize music player
  initMusicPlayer();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize secret heart button
  initSecretHeart();

  // Initialize countdown
  initCountdown();

  // Add interactive elements
  addInteractiveElements();

  // Start animations
  startLyricsAnimation();

  // Add click event to entire document for audio unlock
  document.addEventListener("click", unlockAudio, { once: true });
});

// YouTube API callback
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("youtubePlayer", {
    height: "100",
    width: "100",
    videoId: "OPFmjthC8LY",
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      modestbranding: 1,
      playlist: "OPFmjthC8LY",
    },
    events: {
      onReady: onYouTubePlayerReady,
      onStateChange: onYouTubePlayerStateChange,
      onError: onYouTubePlayerError,
    },
  });
}

function onYouTubePlayerReady(event) {
  isYouTubeReady = true;
  console.log("YouTube player ready");

  // Set volume to 50% by default
  event.target.setVolume(50);

  // Update volume slider
  document.getElementById("volumeSlider").value = 50;

  console.log("YouTube player is ready. Click anywhere to start music.");
}

function onYouTubePlayerStateChange(event) {
  const playingIndicator = document.getElementById("playingIndicator");

  switch (event.data) {
    case YT.PlayerState.PLAYING:
      playingIndicator.style.display = "inline-flex";
      startProgressUpdate();
      break;
    case YT.PlayerState.PAUSED:
      playingIndicator.style.display = "none";
      stopProgressUpdate();
      break;
    case YT.PlayerState.ENDED:
      // Video ended, but loop should restart it
      playingIndicator.style.display = "none";
      stopProgressUpdate();
      break;
  }

  updatePlayButton();
}

function onYouTubePlayerError(event) {
  console.error("YouTube Player Error:", event.data);
  document.querySelector(".song-title").textContent =
    "Music unavailable - YouTube error";
}

// Music Player Functions
function initMusicPlayer() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const muteBtn = document.getElementById("muteBtn");
  const volumeSlider = document.getElementById("volumeSlider");

  // Play/Pause functionality
  playPauseBtn.addEventListener("click", function () {
    togglePlayPause();
  });

  // Mute functionality
  muteBtn.addEventListener("click", function () {
    toggleMute();
  });

  // Volume slider functionality
  volumeSlider.addEventListener("input", function () {
    setVolume(this.value);
  });

  // Initialize buttons
  updatePlayButton();
  updateMuteButton();
}

function unlockAudio() {
  if (isYouTubeReady) {
    // Start playing when user first interacts
    youtubePlayer.playVideo();
  }
}

function togglePlayPause() {
  if (!isYouTubeReady) return;

  if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
}

function toggleMute() {
  if (!isYouTubeReady) return;

  if (youtubePlayer.isMuted()) {
    youtubePlayer.unMute();
  } else {
    youtubePlayer.mute();
  }
  updateMuteButton();
}

function setVolume(volume) {
  if (!isYouTubeReady) return;
  youtubePlayer.setVolume(volume);
  updateMuteButton();
}

function updatePlayButton() {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const icon = playPauseBtn.querySelector("i");

  if (!isYouTubeReady) {
    icon.className = "fas fa-play";
    return;
  }

  if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
    icon.className = "fas fa-pause";
  } else {
    icon.className = "fas fa-play";
  }
}

function updateMuteButton() {
  const muteBtn = document.getElementById("muteBtn");
  const icon = muteBtn.querySelector("i");
  const volumeSlider = document.getElementById("volumeSlider");

  if (!isYouTubeReady) {
    icon.className = "fas fa-volume-up";
    return;
  }

  if (youtubePlayer.isMuted() || youtubePlayer.getVolume() === 0) {
    icon.className = "fas fa-volume-mute";
  } else {
    icon.className = "fas fa-volume-up";
  }

  // Update slider to match actual volume
  if (!youtubePlayer.isMuted()) {
    volumeSlider.value = youtubePlayer.getVolume();
  }
}

function startProgressUpdate() {
  stopProgressUpdate(); // Clear any existing interval
  progressInterval = setInterval(updateProgressBar, 1000);
}

function stopProgressUpdate() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function updateProgressBar() {
  if (!isYouTubeReady) return;

  const progress = document.getElementById("progress");
  const duration = youtubePlayer.getDuration();
  const currentTime = youtubePlayer.getCurrentTime();

  if (duration > 0) {
    const percent = (currentTime / duration) * 100;
    progress.style.width = percent + "%";
  }
}

// Enhanced scroll animations
function initScrollAnimations() {
  const messageTexts = document.querySelectorAll(".message-text, .signature");
  const timelineContents = document.querySelectorAll(".timeline-content");
  const qualityCards = document.querySelectorAll(".quality-card");

  // Show initial elements
  setTimeout(() => {
    messageTexts.forEach((text) => {
      text.classList.add("show");
    });
  }, 500);

  // Scroll event listener
  const scrollHandler = function () {
    // Message texts
    messageTexts.forEach((text) => {
      const elementTop = text.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 100) {
        text.classList.add("show");
      }
    });

    // Timeline items
    timelineContents.forEach((content, index) => {
      const elementTop = content.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 100) {
        setTimeout(() => {
          content.classList.add("show");
        }, index * 200);
      }
    });

    // Quality cards
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

  // Trigger initial check
  scrollHandler();
}

// Countdown Timer
function initCountdown() {
  // Set the date when you first met or started liking her
  const startDate = new Date("2024-01-01"); // Change this to your actual date

  function updateCountdown() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Lyrics Animation
function startLyricsAnimation() {
  const lyricLines = document.querySelectorAll(".lyric-line");

  function animateLyrics() {
    lyricLines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add("show");
      }, (index + 1) * 1500);
    });
  }

  animateLyrics();

  // Restart animation every 15 seconds
  setInterval(() => {
    lyricLines.forEach((line) => {
      line.classList.remove("show");
    });
    setTimeout(() => {
      animateLyrics();
    }, 500);
  }, 15000);
}

// Create floating hearts in background
function createFloatingHearts() {
  const heartsContainer = document.querySelector(".hearts-container");
  const heartCount = 20;

  for (let i = 0; i < heartCount; i++) {
    createHeart(heartsContainer, i);
  }

  // Add more hearts periodically
  setInterval(() => {
    if (document.querySelectorAll(".heart").length < 30) {
      createHeart(heartsContainer, Math.random() * 1000);
    }
  }, 3000);
}

function createHeart(container, index) {
  const heart = document.createElement("div");
  heart.classList.add("heart");

  // Random properties
  const left = Math.random() * 100;
  const delay = Math.random() * 10;
  const duration = 15 + Math.random() * 15;
  const size = 8 + Math.random() * 20;

  heart.style.left = `${left}vw`;
  heart.style.animation = `float ${duration}s linear infinite`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  // Random color with pink variations
  const colors = ["#ff6b93", "#ff8fab", "#ffb3c6", "#ffcad4", "#ff4d7d"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  heart.style.color = color;

  container.appendChild(heart);
}

// Initialize secret heart button and modal
function initSecretHeart() {
  const secretHeart = document.getElementById("secretHeart");
  const modal = document.getElementById("secretModal");
  const closeBtn = document.querySelector(".close");

  secretHeart.addEventListener("click", function () {
    modal.style.display = "block";
    createSmallHearts();
    createConfetti();

    // Try to play audio if not already playing
    if (
      isYouTubeReady &&
      youtubePlayer.getPlayerState() !== YT.PlayerState.PLAYING
    ) {
      youtubePlayer.playVideo();
    }
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

// Create small floating hearts in modal
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

// Create confetti effect
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

    // Remove confetti after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.remove();
      }
    }, animationDuration * 1000);
  }
}

// Add additional interactive elements
function addInteractiveElements() {
  // Photo frames click effect
  const photoFrames = document.querySelectorAll(".photo-frame");
  photoFrames.forEach((frame) => {
    frame.addEventListener("click", function () {
      this.style.transform = "rotateY(20deg) scale(1.1)";
      setTimeout(() => {
        this.style.transform = "rotateY(0deg) scale(1)";
      }, 600);
    });
  });

  // Social buttons
  const socialBtns = document.querySelectorAll(".social-btn");
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      createConfetti();

      // Add temporary animation
      this.style.transform = "scale(1.3)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 300);
    });
  });

  // Title pulse animation
  setInterval(() => {
    const title = document.querySelector(".title");
    title.style.animation = "none";
    setTimeout(() => {
      title.style.animation = "gentlePulse 4s infinite";
    }, 10);
  }, 8000);

  // Background color transition
  let hue = 0;
  setInterval(() => {
    hue = (hue + 0.1) % 360;
    document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 30%, 95%) 0%, hsl(${
      hue + 30
    }, 40%, 97%) 100%)`;
  }, 5000);
}

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Press 'L' for love (secret message)
  if (e.key === "l" || e.key === "L") {
    const modal = document.getElementById("secretModal");
    modal.style.display = "block";
    createSmallHearts();
    createConfetti();
  }

  // Press 'M' to toggle music
  if (e.key === "m" || e.key === "M") {
    togglePlayPause();
  }

  // Press 'Space' to create hearts
  if (e.key === " ") {
    createConfetti();
  }
});

// Add floatUp animation for confetti
const style = document.createElement("style");
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console message
console.log(
  "%c 💖 You found the secret! This website is a love letter to someone very special. 💖",
  "color: #ff6b93; font-size: 16px; font-weight: bold;"
);
console.log(
  "%c 🎵 Now playing: Blue - Over October 🎵",
  "color: #667eea; font-size: 14px; font-style: italic;"
);
console.log(
  "%c 💝 Click anywhere on the page to start the music! 💝",
  "color: #ff6b93; font-size: 12px;"
);
