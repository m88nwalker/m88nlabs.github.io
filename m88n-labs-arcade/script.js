/* =========================================================
   M88N LABS ARCADE
   script.js
========================================================= */

"use strict";

const games = [
  {
    id: "townie-runner",
    title: "Townie Runner",
    description: "Run, recruit Townies, collect coins, and get everyone through the door.",
    symbol: "🏃",
    theme: "theme-runner",
    accent: "cyan",
    status: "PLAYABLE",
    statusClass: "status-playable",
    playable: true,
    url: "./townie-runner/index.html"
  },
  {
    id: "owls-vs-invaders",
    title: "Owls vs Invaders",
    description: "Defend the skies from wave after wave of incoming invaders.",
    symbol: "🦉",
    theme: "theme-owls",
    accent: "purple",
    status: "PLAYABLE",
    statusClass: "status-playable",
    playable: true,
    url: "./owls-vs-invaders/index.html"
  },
  {
    id: "crypto-time-travellers",
    title: "Crypto Time Travellers",
    description: "Travel through crypto history and survive the strangest timeline imaginable.",
    symbol: "⏳",
    theme: "theme-time",
    accent: "orange",
    status: "PLAYABLE",
    statusClass: "status-playable",
    playable: true,
    url: "./crypto-time-travellers/index.html"
  },
  {
    id: "bitcoin-piano",
    title: "Bitcoin Piano",
    description: "Play, record, experiment, and turn the Bitcoin blockchain into music.",
    symbol: "🎹",
    theme: "theme-piano",
    accent: "yellow",
    status: "PLAYABLE",
    statusClass: "status-playable",
    playable: true,
    url: "./bitcoin-piano/index.html"
  },
  {
    id: "townie-companion",
    title: "Townie Companion",
    description: "Raise your Townie, care for it, play games, and see what kind of companion it becomes.",
    symbol: "🐾",
    theme: "theme-companion",
    accent: "green",
    status: "PLAYABLE",
    statusClass: "status-playable",
    playable: true,
    url: "./townie-companion/index.html"
  },
  {
    id: "townie-jam-arena",
    title: "Townie Jam Arena",
    description: "Battle enemies, build combos, and turn every fight into music.",
    symbol: "⚔️",
    theme: "theme-arena",
    accent: "pink",
    status: "IN DEVELOPMENT",
    statusClass: "status-development",
    playable: false,
    url: ""
  },
  {
    id: "classified",
    title: "Classified",
    description: "Unauthorized experiment. Details unavailable.",
    symbol: "?",
    theme: "theme-classified",
    accent: "classified",
    status: "COMING SOON",
    statusClass: "status-classified",
    playable: false,
    url: ""
  }
];

const gameGrid = document.getElementById("gameGrid");
const gameCount = document.getElementById("gameCount");
const currentYear = document.getElementById("currentYear");
const sparkField = document.getElementById("sparkField");

function createGameCard(game, index) {
  const card = document.createElement(game.playable ? "a" : "article");
  card.className = `game-card ${game.playable ? "is-playable" : ""} accent-${game.accent}`;

  if (game.playable) {
    card.href = game.url;
    card.setAttribute("aria-label", `Play ${game.title}`);
  }

  const number = String(index + 1).padStart(2, "0");

  card.innerHTML = `
    <div class="cabinet-lights" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </div>

    <div class="game-art ${game.theme}">
      <div class="card-grid" aria-hidden="true"></div>
      <div class="game-symbol" aria-hidden="true">${game.symbol}</div>
      <div class="game-particles" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>

    <div class="game-status ${game.statusClass}">
      <span class="status-mini-light"></span>
      ${game.status}
    </div>

    <div class="game-content">
      <div class="game-number">EXPERIMENT_${number}</div>
      <h3 class="game-title">${game.title}</h3>
      <p class="game-description">${game.description}</p>
      <div class="game-action">
        <span class="play-label">${game.playable ? "INSERT CURIOSITY" : game.status}</span>
        ${game.playable ? '<span class="play-arrow" aria-hidden="true">▶</span>' : ""}
      </div>
    </div>

    <div class="card-sheen" aria-hidden="true"></div>
  `;

  return card;
}

function renderGames() {
  gameGrid.innerHTML = "";
  games.forEach((game, index) => gameGrid.appendChild(createGameCard(game, index)));
  gameCount.textContent = `${games.filter(game => game.playable).length} GAMES ONLINE`;
}

function buildSparkField() {
  if (!sparkField) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sparkCount = reducedMotion ? 12 : 32;
  const colors = ["cyan", "pink", "purple", "orange", "green", "yellow"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < sparkCount; i += 1) {
    const spark = document.createElement("i");
    spark.className = `ambient-spark spark-${colors[i % colors.length]}`;
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    spark.style.setProperty("--spark-delay", `${-(Math.random() * 14).toFixed(2)}s`);
    spark.style.setProperty("--spark-duration", `${(8 + Math.random() * 12).toFixed(2)}s`);
    spark.style.setProperty("--spark-scale", `${(0.55 + Math.random() * 1.2).toFixed(2)}`);
    fragment.appendChild(spark);
  }

  sparkField.replaceChildren(fragment);
}

function startLightChase() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const cards = Array.from(document.querySelectorAll(".game-card"));
  if (!cards.length) return;

  let timer = 0;

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const card = cards[Math.floor(Math.random() * cards.length)];
      card.classList.add("light-chase");
      setTimeout(() => card.classList.remove("light-chase"), 1500);
      schedule();
    }, 2800 + Math.random() * 4200);
  }

  schedule();
}

function setCurrentYear() {
  currentYear.textContent = new Date().getFullYear();
}

renderGames();
buildSparkField();
setCurrentYear();
startLightChase();
