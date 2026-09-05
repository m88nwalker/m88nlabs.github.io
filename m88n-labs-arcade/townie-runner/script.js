(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => min + Math.random() * (max - min);
  const chance = (value) => Math.random() < value;

  const STORAGE = {
    games: "townieRunnerGames",
    best: "townieRunnerBest",
    coins: "townieRunnerCoins",
    scores: "townieRunnerScores",
    mode: "townieRunnerMode",
    difficulty: "townieRunnerDifficulty"
  };

  const stats = {
    games: Number(localStorage.getItem(STORAGE.games)) || 0,
    best: Number(localStorage.getItem(STORAGE.best)) || 0,
    coins: Number(localStorage.getItem(STORAGE.coins)) || 0,
    scores: JSON.parse(localStorage.getItem(STORAGE.scores) || "[]")
  };

  const dialog = $("gameDialog");
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const TOWNIE_COUNT = 21;
  const townieImages = Array.from({ length: TOWNIE_COUNT }, (_, index) => {
    const image = new Image();
    image.src = `assets/townies/townie${index + 1}.png`;
    image.ready = false;
    image.addEventListener("load", () => {
      image.ready = true;
      draw();
    });
    image.addEventListener("error", () => {
      image.ready = false;
    });
    return image;
  });

  let audioContext = null;

  function ensureAudio() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioContext = new AudioContextClass();
    }
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function tone(frequency, duration = 0.08, type = "square", volume = 0.04, delay = 0) {
    ensureAudio();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + delay;
    const end = start + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(end);
  }

  const sounds = {
    jump() { tone(290, 0.07, "square", 0.035); tone(390, 0.06, "square", 0.025, 0.045); },
    coin(streak = 0) {
      const step = Math.min(20, Math.max(0, streak));
      const base = 650 + step * 24;
      tone(base, 0.045, "square", 0.035);
      tone(base * 1.24, 0.06, "triangle", 0.026, 0.035);
    },
    townie() { [440, 554, 659].forEach((f, i) => tone(f, 0.08, "triangle", 0.04, i * 0.07)); },
    doorEntry(count = 1) {
      const notes = [392, 440, 494, 523, 587, 659, 698, 784];
      const played = Math.min(count, 20);
      for (let i = 0; i < played; i += 1) {
        const octave = Math.floor(i / notes.length);
        tone(notes[i % notes.length] * Math.pow(2, octave), 0.055, "triangle", 0.032, i * 0.045);
      }
    },
    doorBonus(count = 5) {
      const sizeBoost = Math.min(0.025, count * 0.0012);
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, "square", 0.04 + sizeBoost, count * 0.045 + i * 0.065));
    },
    environment(index) {
      const cues = [
        [392, 494, 587, 784],
        [523, 659, 880, 1047],
        [330, 294, 247, 196],
        [440, 554, 659, 880]
      ];
      const waveforms = ["triangle", "square", "sawtooth", "sine"];
      const notes = cues[index % cues.length];
      notes.forEach((f, i) => tone(f, 0.12, waveforms[index % waveforms.length], 0.035, i * 0.075));
    },
    life() { [660, 880, 1100].forEach((f, i) => tone(f, 0.1, "sine", 0.05, i * 0.06)); },
    power() { tone(240, 0.16, "sawtooth", 0.035); tone(480, 0.16, "sawtooth", 0.025, 0.08); },
    hit() { tone(120, 0.18, "sawtooth", 0.06); },
    gameOver() { [330, 247, 196, 147].forEach((f, i) => tone(f, 0.16, "square", 0.045, i * 0.12)); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, "triangle", 0.05, i * 0.09)); }
  };

  const environments = [
    { name: "Lunar Sunset", sky1: "#101a45", sky2: "#512766", horizon: "#ee7a35", ground: "#402315", accent: "#ffe2aa" },
    { name: "Neon Night", sky1: "#080b2c", sky2: "#291451", horizon: "#16a4b8", ground: "#101b32", accent: "#61f5ff" },
    { name: "Crimson Rift", sky1: "#1c071b", sky2: "#651a35", horizon: "#f24e3d", ground: "#35121c", accent: "#ffb56b" },
    { name: "Dream Clouds", sky1: "#392b76", sky2: "#8b68bc", horizon: "#f1b7d2", ground: "#503463", accent: "#fff0ff" }
  ];

  const GAME_MODES = {
    normal: {
      key: "normal",
      label: "NORMAL",
      width: 720,
      height: 720,
      groundY: 610,
      scale: 1.18,
      playerX: 92,
      baseSpeed: 265,
      maxSpeed: 565,
      speedGrowth: 0.0105,
      followerSpeedBoost: 5,
      gravity: 2050,
      jumpVelocity: -825,
      doubleJumpVelocity: -760,
      leaderShift: 14,
      followerSpacing: 15
    },
    landscape: {
      key: "landscape",
      label: "LANDSCAPE",
      width: 960,
      height: 360,
      groundY: 292,
      scale: 1,
      playerX: 100,
      baseSpeed: 355,
      maxSpeed: 760,
      speedGrowth: 0.014,
      followerSpeedBoost: 7,
      gravity: 1900,
      jumpVelocity: -760,
      doubleJumpVelocity: -700,
      leaderShift: 18,
      followerSpacing: 18
    }
  };

  const savedMode = localStorage.getItem(STORAGE.mode);
  const initialMode = savedMode && GAME_MODES[savedMode] ? savedMode : "normal";

  const DIFFICULTIES = {
    easy: {
      key: "easy",
      label: "EASY CHAIN"
    },
    hard: {
      key: "hard",
      label: "HARD CREW"
    }
  };

  const savedDifficulty = localStorage.getItem(STORAGE.difficulty);
  const initialDifficulty = savedDifficulty && DIFFICULTIES[savedDifficulty]
    ? savedDifficulty
    : "easy";

  const modeConfig = () => GAME_MODES[game.mode];
  const scaleValue = (value) => value * modeConfig().scale;

  const game = {
    mode: initialMode,
    difficulty: initialDifficulty,
    running: false,
    ending: false,
    won: false,
    score: 0,
    speed: GAME_MODES[initialMode].baseSpeed,
    gravity: GAME_MODES[initialMode].gravity,
    lastTime: 0,
    animationId: 0,
    groundY: GAME_MODES[initialMode].groundY,
    lives: 3,
    runCoins: 0,
    streak: 0,
    bestStreak: 0,
    invulnerable: 0,
    flashTimer: 0,
    elapsed: 0,
    environmentIndex: 0,
    savedTownies: 0,
    scoreSaved: false,
    finalRun: null,
    spawnTimer: 0,
    nextSpawn: 1.15,
    followerTimer: 0,
    nextFollower: rand(3.5, 6),
    doorTimer: 0,
    nextDoor: rand(13, 20),
    lifeTimer: 0,
    nextLife: rand(16, 26),
    powerTimer: 0,
    nextPower: rand(10, 17),
    activePower: null,
    powerRemaining: 0,
    airJumpsUsed: 0,
    chainHitCooldown: 0,
    player: {
      x: GAME_MODES[initialMode].playerX,
      y: GAME_MODES[initialMode].groundY - 62 * GAME_MODES[initialMode].scale,
      width: 54 * GAME_MODES[initialMode].scale,
      height: 62 * GAME_MODES[initialMode].scale,
      velocityY: 0,
      onGround: true,
      frame: 0,
      frameTimer: 0,
      jumped: false
    },
    obstacles: [],
    coins: [],
    platforms: [],
    followers: [],
    recruitables: [],
    doors: [],
    extraLives: [],
    powers: [],
    particles: [],
    movementHistory: []
  };

  function applyMode(modeKey, save = true) {
    if (!GAME_MODES[modeKey]) modeKey = "normal";
    if (game.running) return;

    game.mode = modeKey;
    const config = modeConfig();

    canvas.width = config.width;
    canvas.height = config.height;
    ctx.imageSmoothingEnabled = false;

    game.groundY = config.groundY;
    game.gravity = config.gravity;
    game.speed = config.baseSpeed;

    game.player.width = 54 * config.scale;
    game.player.height = 62 * config.scale;
    game.player.x = config.playerX;
    game.player.y = game.groundY - game.player.height;

    dialog.classList.toggle("normal-mode", modeKey === "normal");
    dialog.classList.toggle("landscape-mode", modeKey === "landscape");

    $("normalModeBtn")?.classList.toggle("selected", modeKey === "normal");
    $("landscapeModeBtn")?.classList.toggle("selected", modeKey === "landscape");
    $("normalModeBtn")?.setAttribute("aria-pressed", String(modeKey === "normal"));
    $("landscapeModeBtn")?.setAttribute("aria-pressed", String(modeKey === "landscape"));
    if ($("modeLabel")) {
      $("modeLabel").textContent = `// ${config.label} · ${DIFFICULTIES[game.difficulty].label}`;
    }

    if (save) localStorage.setItem(STORAGE.mode, modeKey);
    updateMobileSetupSummary();
    draw();
  }

  function applyDifficulty(difficultyKey, save = true) {
    if (!DIFFICULTIES[difficultyKey]) difficultyKey = "easy";
    if (game.running) return;

    game.difficulty = difficultyKey;

    $("easyDifficultyBtn")?.classList.toggle("selected", difficultyKey === "easy");
    $("hardDifficultyBtn")?.classList.toggle("selected", difficultyKey === "hard");
    $("easyDifficultyBtn")?.setAttribute("aria-pressed", String(difficultyKey === "easy"));
    $("hardDifficultyBtn")?.setAttribute("aria-pressed", String(difficultyKey === "hard"));

    if ($("modeLabel")) {
      $("modeLabel").textContent = `// ${modeConfig().label} · ${DIFFICULTIES[difficultyKey].label}`;
    }

    if (save) localStorage.setItem(STORAGE.difficulty, difficultyKey);
    updateMobileSetupSummary();
  }

  function updateMobileSetupSummary() {
    // Mobile setup bar is intentionally label-only.
  }

  function setMobileSetupExpanded(expanded) {
    const toggle = $("mobileSetupToggle");
    const panel = $("homeUtilityPanel");
    if (!toggle || !panel) return;

    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.classList.toggle("expanded", expanded);
    panel.classList.toggle("mobile-collapsed", !expanded);
  }

  function updateStats() {
    if ($("gamesPlayed")) $("gamesPlayed").textContent = stats.games.toLocaleString();
    if ($("totalCoins")) $("totalCoins").textContent = stats.coins.toLocaleString();
    if ($("bestScore")) $("bestScore").textContent = stats.best.toLocaleString();
    if ($("dialogBest")) $("dialogBest").textContent = stats.best.toLocaleString();
    if ($("homeGamesPlayed")) $("homeGamesPlayed").textContent = stats.games.toLocaleString();
    if ($("homeTotalCoins")) $("homeTotalCoins").textContent = stats.coins.toLocaleString();
    if ($("homeBestScore")) $("homeBestScore").textContent = stats.best.toLocaleString();
  }

  function updateHud() {
    $("score").textContent = `\u{2B50} ${Math.max(0, Math.floor(game.score)).toLocaleString()}`;
    $("runCoins").textContent = `\u{1F4B0} ${game.runCoins}`;
    $("streak").textContent = `\u{1F525} ×${game.streak}`;
    $("lives").textContent = `\u{2764}\u{FE0F} ${game.lives}`;
    $("followers").textContent = `\u{1F3C3} ${game.followers.length}`;
    $("savedTownies").textContent = `\u{1F6AA} ${game.savedTownies}`;

    if (game.activePower) {
      $("powerHud").hidden = false;
      $("powerName").textContent = game.activePower.label;
      $("powerBar").style.width = `${clamp(game.powerRemaining / game.activePower.duration, 0, 1) * 100}%`;
    } else {
      $("powerHud").hidden = true;
    }
  }

  function renderLeaderboard() {
    const board = $("leaderboard");
    board.innerHTML = '<div class="leaderboard-row leaderboard-head"><span>#</span><span>Player</span><span>Points</span><span>Coins</span><span>Streak</span><span>Saved</span></div>';

    if (!stats.scores.length) {
      board.innerHTML += '<div class="leaderboard-row"><span>—</span><span>No rescued Townies yet</span><span>0</span><span>0</span><span>×0</span><span>0</span></div>';
      return;
    }

    stats.scores.slice(0, 10).forEach((entry, index) => {
      const row = document.createElement("div");
      row.className = "leaderboard-row";
      row.innerHTML = `
        <span>${index + 1}</span>
        <span>${entry.name || "TOWNIE"}</span>
        <span>${Number(entry.score || 0).toLocaleString()}</span>
        <span>\u{1F4B0} ${Number(entry.coins || 0).toLocaleString()}</span>
        <span>\u{1F525} ×${Number(entry.streak || 0).toLocaleString()}</span>
        <span>\u{1F6AA} ${Number(entry.saved || 0).toLocaleString()}</span>`;
      board.appendChild(row);
    });
  }

  function commitFinishedRun() {
    if (game.scoreSaved || !game.finalRun) return;

    const name = ($("playerName").value.trim() || "TOWNIE").slice(0, 12).toUpperCase();
    stats.scores.push({ name, ...game.finalRun });
    stats.scores.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    stats.scores = stats.scores.slice(0, 10);
    localStorage.setItem(STORAGE.scores, JSON.stringify(stats.scores));
    game.scoreSaved = true;
    renderLeaderboard();
  }

  function resetGame() {
    cancelAnimationFrame(game.animationId);

    game.running = false;
    game.ending = false;
    game.won = false;
    game.score = 0;
    const config = modeConfig();
    game.speed = config.baseSpeed;
    game.gravity = config.gravity;
    game.groundY = config.groundY;
    game.lastTime = 0;
    game.lives = 3;
    game.runCoins = 0;
    game.streak = 0;
    game.bestStreak = 0;
    game.invulnerable = 0;
    game.flashTimer = 0;
    game.elapsed = 0;
    game.environmentIndex = 0;
    game.savedTownies = 0;
    game.scoreSaved = false;
    game.finalRun = null;
    game.spawnTimer = 0;
    game.nextSpawn = 1.15;
    game.followerTimer = 0;
    game.nextFollower = rand(3.5, 6);
    game.doorTimer = 0;
    game.nextDoor = rand(13, 20);
    game.lifeTimer = 0;
    game.nextLife = rand(16, 26);
    game.powerTimer = 0;
    game.nextPower = rand(10, 17);
    game.activePower = null;
    game.powerRemaining = 0;
    game.airJumpsUsed = 0;
    game.chainHitCooldown = 0;

    game.obstacles = [];
    game.coins = [];
    game.platforms = [];
    game.followers = [];
    game.recruitables = [];
    game.doors = [];
    game.extraLives = [];
    game.powers = [];
    game.particles = [];
    game.movementHistory = [];

    Object.assign(game.player, {
      y: game.groundY - game.player.height,
      velocityY: 0,
      onGround: true,
      frame: 0,
      frameTimer: 0,
      jumped: false,
      x: config.playerX,
      width: 54 * config.scale,
      height: 62 * config.scale
    });

    $("nameEntry").hidden = true;
    updateHud();
    draw();
  }

  function openGame() {
    document.querySelectorAll(".page").forEach((page) => page.classList.remove("visible"));
    dialog.hidden = false;
    dialog.classList.add("visible");
    resetGame();
    $("overlayTitle").textContent = "Ready?";
    $("overlayText").textContent = "Enter your leaderboard name, then start your run.";
    $("nameEntry").hidden = false;
    $("preRunInfo").hidden = false;
    $("startBtn").textContent = "Start Run";
    $("overlayLeaderboardBtn").hidden = true;
    $("overlay").classList.remove("hidden");
    window.setTimeout(() => $("playerName")?.select(), 50);
  }

  function closeGame() {
    game.running = false;
    cancelAnimationFrame(game.animationId);
    dialog.classList.remove("visible");
    dialog.hidden = true;
    showPage("homePage");
  }

  function startGame() {
    ensureAudio();
    resetGame();
    game.running = true;
    $("overlay").classList.add("hidden");
    game.animationId = requestAnimationFrame(gameLoop);
  }

  function jump() {
    if (!game.running) return;

    const canGroundJump = game.player.onGround;
    const canDoubleJump = game.activePower?.key === "doubleJump" && game.airJumpsUsed < 1;
    if (!canGroundJump && !canDoubleJump) return;

    const config = modeConfig();
    game.player.velocityY = canGroundJump ? config.jumpVelocity : config.doubleJumpVelocity;
    game.player.onGround = false;
    game.player.jumped = true;

    if (canGroundJump) {
      game.airJumpsUsed = 0;
      sounds.jump();
    } else {
      game.airJumpsUsed += 1;
      spawnParticles(game.player.x + 20, game.player.y + game.player.height, "\u{2728}", 6);
      tone(420, 0.07, "square", 0.035);
      tone(620, 0.08, "square", 0.03, 0.045);
      showToast("\u{1F46F} Double jump!");
    }
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 1100);
  }

  function spawnParticles(x, y, symbol, count = 6) {
    for (let i = 0; i < count; i += 1) {
      game.particles.push({
        x,
        y,
        vx: rand(-90, 90),
        vy: rand(-160, -50),
        life: rand(0.45, 0.8),
        symbol
      });
    }
  }

  function isAreaClear(candidate, padding = 18, ignoreItem = null) {
    const groups = [game.obstacles, game.coins, game.platforms, game.recruitables, game.doors, game.extraLives, game.powers];
    return groups.every((group) => group.every((item) => {
      if (item === ignoreItem) return true;
      const a = {
        x: candidate.x - padding,
        y: candidate.y - padding,
        width: candidate.width + padding * 2,
        height: candidate.height + padding * 2
      };
      return !rectOverlap(a, item, 0);
    }));
  }

  function maxPlatformTier() {
    if (game.mode === "landscape") return game.environmentIndex >= 1 ? 2 : 1;
    if (game.environmentIndex >= 3) return 4;
    if (game.environmentIndex >= 2) return 3;
    if (game.environmentIndex >= 1) return 2;
    return 1;
  }

  function platformYForTier(tier) {
    const scale = modeConfig().scale;
    if (game.mode === "landscape") {
      const offsets = [0, 118, 210];
      return game.groundY - offsets[tier] * scale;
    }
    const offsets = [0, 118, 220, 320, 415];
    return game.groundY - offsets[tier] * scale;
  }

  function tierFitsPlayArea(tier) {
    return platformYForTier(tier) - game.player.height >= 18;
  }

  function addCoinTrail(x1, y1, x2, y2, count = 4) {
    const scale = modeConfig().scale;
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const coin = {
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * 22 * scale,
        width: 26 * scale,
        height: 26 * scale,
        collected: false,
        bob: rand(0, Math.PI * 2)
      };
      if (isAreaClear(coin, 6)) game.coins.push(coin);
    }
  }

  function availableTownieIndex() {
    const unavailable = new Set([
      ...game.followers.map((follower) => follower.townieIndex),
      ...game.recruitables.filter((item) => !item.collected).map((item) => item.townieIndex)
    ]);
    const available = Array.from({ length: TOWNIE_COUNT - 1 }, (_, index) => index + 1)
      .filter((townieIndex) => !unavailable.has(townieIndex));
    if (!available.length) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function addTownieOnPlatform(platform) {
    const scale = modeConfig().scale;
    const townieIndex = availableTownieIndex();
    if (townieIndex === null) return false;

    const direction = chance(0.5) ? -1 : 1;
    const recruit = {
      x: platform.x + Math.max(18 * scale, platform.width * rand(0.25, 0.6)),
      y: platform.y - 54 * scale,
      width: 48 * scale,
      height: 54 * scale,
      townieIndex,
      frame: 0,
      frameTimer: 0,
      direction,
      runSpeed: rand(50, 88) * scale,
      platform,
      leavePlatform: chance(0.38),
      airborne: false,
      velocityY: 0
    };

    if (isAreaClear(recruit, 18, platform)) {
      game.recruitables.push(recruit);
      return true;
    }
    return false;
  }

  function addCoins(baseX, baseY, count = 4, arc = false) {
    const scale = modeConfig().scale;
    const spacing = 52 * scale;
    for (let i = 0; i < count; i += 1) {
      const coin = {
        x: baseX + i * spacing,
        y: baseY - (arc ? Math.sin((i / Math.max(1, count - 1)) * Math.PI) * 55 * scale : 0),
        width: 26 * scale,
        height: 26 * scale,
        collected: false,
        bob: rand(0, Math.PI * 2)
      };
      if (isAreaClear(coin, 8)) game.coins.push(coin);
    }
  }

  function addPlatformRoute(highestTier, baseX) {
    const scale = modeConfig().scale;
    const route = [];
    const horizontalStep = (game.mode === "landscape" ? 126 : 118) * scale;

    // Lower platforms appear first (farther left) so the player encounters
    // them before the higher platforms and can climb naturally.
    for (let tier = 1; tier <= highestTier; tier += 1) {
      if (!tierFitsPlayArea(tier)) break;

      const platform = {
        x: baseX + (tier - 1) * horizontalStep,
        y: platformYForTier(tier),
        width: rand(142, 188) * scale,
        height: 16 * scale,
        tier
      };

      // Route members are allowed to sit near each other by design, so only
      // reject collisions with unrelated gameplay objects.
      const blockers = [
        ...game.obstacles,
        ...game.recruitables,
        ...game.doors,
        ...game.extraLives,
        ...game.powers
      ];

      const blocked = blockers.some((item) => rectOverlap({
        x: platform.x - 16 * scale,
        y: platform.y - 12 * scale,
        width: platform.width + 32 * scale,
        height: platform.height + 24 * scale
      }, item, 0));

      if (blocked) continue;

      game.platforms.push(platform);
      route.push(platform);

      addCoins(
        platform.x + 18 * scale,
        platform.y - 38 * scale,
        chance(0.34) ? 4 : 3,
        false
      );

      const lowerY = tier === 1
        ? game.groundY - 58 * scale
        : platformYForTier(tier - 1) - 38 * scale;

      addCoinTrail(
        platform.x - 92 * scale,
        lowerY,
        platform.x + 12 * scale,
        platform.y - 40 * scale,
        4
      );

      if (chance(0.64)) {
        addTownieOnPlatform(platform);
      }
    }

    return route;
  }

  function addObstacle() {
    const scale = modeConfig().scale;
    const x = canvas.width + 40 * scale;
    const roll = Math.random();

    // Platforms become a much more important part of the level design as
    // each color stage unlocks. Stage 1 still introduces them gently, while
    // later stages build a visibly denser vertical route network.
    const platformChanceByStage = [0.30, 0.48, 0.56, 0.62];
    const platformChance = platformChanceByStage[game.environmentIndex] || 0.30;

    if (roll < platformChance && game.score > 650) {
      let highestTier = maxPlatformTier();
      while (highestTier > 1 && !tierFitsPlayArea(highestTier)) highestTier -= 1;

      const tierPool = [];
      for (let tier = 1; tier <= highestTier; tier += 1) {
        // Favor the newest tier, but when a higher tier is chosen the whole
        // staircase underneath it is generated as one climbable route.
        const weight = tier === highestTier
          ? 6
          : tier === highestTier - 1
            ? 3
            : 2;

        for (let i = 0; i < weight; i += 1) tierPool.push(tier);
      }

      const chosenTier = tierPool[Math.floor(Math.random() * tierPool.length)] || 1;
      addPlatformRoute(chosenTier, x);
    } else {
      const type = roll < 0.48 ? "rock" : roll < 0.76 ? "crystal" : "drone";
      const specs = {
        rock: { width: 44 * scale, height: 46 * scale, y: game.groundY - 46 * scale },
        crystal: { width: 32 * scale, height: 70 * scale, y: game.groundY - 70 * scale },
        drone: { width: 56 * scale, height: 30 * scale, y: game.groundY - 118 * scale }
      }[type];
      const obstacle = { x, y: specs.y, width: specs.width, height: specs.height, type, cleared: false };
      if (isAreaClear(obstacle, 28)) game.obstacles.push(obstacle);
    }

    if (chance(0.72)) addCoins(x + rand(70, 120) * scale, game.groundY - rand(68, 105) * scale, chance(0.45) ? 5 : 3, chance(0.6));
    const stageSpawnBonus = game.environmentIndex * 0.045;
    game.nextSpawn = Math.max(
      0.66,
      1.45 - game.score / 18000 - stageSpawnBonus
    ) + rand(0.08, 0.34);
  }

  function addRecruitable() {
    const scale = modeConfig().scale;
    const townieIndex = availableTownieIndex();
    if (townieIndex === null) { game.nextFollower = rand(4.5, 7.5); return; }

    const platformCandidates = game.platforms.filter((platform) => (
      platform.x > canvas.width * 0.58 &&
      platform.x < canvas.width + 180 * scale &&
      platform.width >= 120 * scale
    ));
    const usePlatform = platformCandidates.length > 0 && chance(0.50);
    const platform = usePlatform ? platformCandidates[Math.floor(Math.random() * platformCandidates.length)] : null;

    const direction = chance(0.5) ? -1 : 1;
    const recruit = {
      x: platform ? platform.x + Math.max(18 * scale, platform.width * rand(0.28, 0.62)) : canvas.width + 45 * scale,
      y: platform ? platform.y - 54 * scale : game.groundY - 54 * scale,
      width: 48 * scale,
      height: 54 * scale,
      townieIndex,
      frame: 0,
      frameTimer: 0,
      direction,
      runSpeed: rand(50, 88) * scale,
      platform: platform || null,
      leavePlatform: platform ? chance(0.38) : false,
      airborne: false,
      velocityY: 0
    };
    if (isAreaClear(recruit, platform ? 18 : 35, platform)) game.recruitables.push(recruit);
    game.nextFollower = rand(4.5, 7.5);
  }

  function addDoor() {
    const scale = modeConfig().scale;
    const door = { x: canvas.width + 50 * scale, y: game.groundY - 92 * scale, width: 58 * scale, height: 92 * scale, pulse: 0 };
    if (isAreaClear(door, 42)) game.doors.push(door);
    game.nextDoor = rand(15, 24);
  }

  function addExtraLife() {
    const scale = modeConfig().scale;
    const life = { x: canvas.width + 50 * scale, y: game.groundY - rand(82, 125) * scale, width: 34 * scale, height: 34 * scale, bob: 0 };
    if (isAreaClear(life, 32)) game.extraLives.push(life);
    game.nextLife = rand(18, 30);
  }

  function addPower() {
    const scale = modeConfig().scale;
    const choices = [
      { key: "shield", label: "\u{1F6E1}\u{FE0F} SHIELD", duration: 8 },
      { key: "magnet", label: "\u{1F9F2} MAGNET", duration: 9 },
      { key: "double", label: "\u{26A1} 2\u{00D7} SCORE", duration: 8 },
      { key: "doubleJump", label: "\u{1F46F} DOUBLE JUMP", duration: 10 }
    ];
    const data = choices[Math.floor(Math.random() * choices.length)];
    const power = { x: canvas.width + 50 * scale, y: game.groundY - rand(88, 130) * scale, width: 36 * scale, height: 36 * scale, ...data, bob: 0 };
    if (isAreaClear(power, 35)) game.powers.push(power);
    game.nextPower = rand(12, 20);
  }

  function rectOverlap(a, b, inset = 5) {
    return (
      a.x + inset < b.x + b.width &&
      a.x + a.width - inset > b.x &&
      a.y + inset < b.y + b.height &&
      a.y + a.height - inset > b.y
    );
  }

  function followerPosition(index) {
    const config = modeConfig();
    const delayFrames = (index + 1) * 5;
    const historyIndex = Math.max(0, game.movementHistory.length - 1 - delayFrames);
    const snapshot = game.movementHistory[historyIndex] || { y: game.player.y, frame: game.player.frame };
    const spacing = config.followerSpacing;
    return {
      x: game.player.x - (index + 1) * spacing,
      y: snapshot.y + 7 * config.scale,
      width: 42 * config.scale,
      height: 48 * config.scale,
      frame: snapshot.frame
    };
  }

  function crewRects() {
    return [game.player, ...game.followers.map((_, index) => followerPosition(index))];
  }

  function crewOverlaps(item, inset = 5) {
    return crewRects().some((member) => rectOverlap(member, item, inset));
  }

  function breakFollowerChain(hitIndex, obstacle) {
    if (game.chainHitCooldown > 0) return;
    if (hitIndex < 0 || hitIndex >= game.followers.length) return;

    const hitPosition = followerPosition(hitIndex);
    const lostFollowers = game.followers.splice(hitIndex);
    if (!lostFollowers.length) return;

    game.chainHitCooldown = 0.75;

    const burstX = hitPosition?.x ?? obstacle.x;
    const burstY = hitPosition?.y ?? obstacle.y;

    lostFollowers.forEach((_, index) => {
      spawnParticles(
        burstX - index * 7,
        burstY + 24,
        "\u{1F4A5}",
        2
      );
    });

    game.streak = 0;
    tone(180, 0.09, "square", 0.04);
    tone(120, 0.12, "sawtooth", 0.03, 0.05);

    showToast(
      lostFollowers.length === 1
        ? "\u{1F4A5} Chain broken! 1 Townie knocked loose"
        : `\u{1F4A5} Chain broken! ${lostFollowers.length} Townies knocked loose`
    );
  }

  function handleObstacleCollision(obstacle) {
    if (game.difficulty === "hard") {
      if (crewOverlaps(obstacle, 8)) hitPlayer();
      return;
    }

    // EASY / CHAIN:
    // The leader is the only crew member who can cost a life.
    if (rectOverlap(game.player, obstacle, 8)) {
      hitPlayer();
      return;
    }

    if (game.chainHitCooldown > 0) return;

    // Each follower is an individual link. If follower N hits the obstacle,
    // follower N and everyone behind them falls off the chain.
    for (let index = 0; index < game.followers.length; index += 1) {
      const followerRect = followerPosition(index);
      if (rectOverlap(followerRect, obstacle, 8)) {
        breakFollowerChain(index, obstacle);
        break;
      }
    }
  }

  function hitPlayer() {
    if (game.invulnerable > 0) return;

    if (game.activePower?.key === "shield") {
      game.activePower = null;
      game.powerRemaining = 0;
      game.invulnerable = 1.2;
      showToast("\u{1F6E1}\u{FE0F} Shield saved you!");
      sounds.power();
      return;
    }

    game.lives -= 1;
    game.invulnerable = 1.8;
    game.flashTimer = 0.35;
    game.streak = 0;
    sounds.hit();
    showToast(
      game.lives > 0
        ? "\uD83D\uDCA5 Ouch! " + game.lives + " lives left"
        : "\uD83D\uDC80 No lives left"
    );

    if (game.lives <= 0) endRun();
  }

  function collectCoin(coin) {
    coin.collected = true;
    game.runCoins += 1;
    game.streak += 1;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    game.score += (game.activePower?.key === "double" ? 40 : 20) + Math.min(100, game.streak * 3);
    spawnParticles(coin.x + 13, coin.y + 13, "\u{1F4B0}", 4);
    sounds.coin(game.streak);
  }

  function recruitTownie(recruit) {
    game.followers.push({ townieIndex: recruit.townieIndex, frame: 0, frameTimer: 0 });
    game.score += 250;
    spawnParticles(recruit.x + 24, recruit.y + 25, "\u{2728}", 8);
    showToast(`\u{1F3C3} Townie rescued! Crew: ${game.followers.length}`);
    sounds.townie();
  }

  function calculateDoorBonus(rescued) {
    let bonus = Math.min(rescued, 5) * 1000;
    bonus += Math.min(Math.max(rescued - 5, 0), 5) * 5000;
    bonus += Math.min(Math.max(rescued - 10, 0), 5) * 20000;
    bonus += Math.min(Math.max(rescued - 15, 0), 5) * 50000;
    if (rescued === TOWNIE_COUNT - 1) bonus += 500000;
    return bonus;
  }

  function enterDoor(door) {
    if (door.cooldown > 0) return;

    const rescued = game.followers.length;
    if (rescued < 5) {
      showToast(`\u{1F6AA} Need ${5 - rescued} more Townies`);
      door.cooldown = 1.25;
      return;
    }

    const requiredCoins = rescued * 10;
    if (game.runCoins < requiredCoins) {
      showToast(`\u{1F4B0} Need ${requiredCoins - game.runCoins} more coins for this crew`);
      door.cooldown = 1.25;
      return;
    }

    game.runCoins -= requiredCoins;
    const bonus = calculateDoorBonus(rescued);
    game.score += bonus;
    game.savedTownies += rescued;
    const previousEnvironment = game.environmentIndex;
    game.environmentIndex = Math.min(environments.length - 1, Math.floor(game.savedTownies / 5));
    if (game.environmentIndex !== previousEnvironment) sounds.environment(game.environmentIndex);
    door.used = true;
    spawnParticles(door.x + 29, door.y + 40, "\u{2B50}", 16);

    if (rescued === TOWNIE_COUNT - 1) {
      sounds.doorEntry(rescued);
      sounds.doorBonus(rescued);
      game.followers = [];
      game.won = true;
      sounds.win();
      finishWin(bonus);
      return;
    }

    sounds.doorEntry(rescued);
    sounds.doorBonus(rescued);
    game.followers = [];
    showToast(`\u{1F6AA} ${rescued} saved! -${requiredCoins} \u{1F4B0} +${bonus.toLocaleString()} \u{2B50}`);
  }

  function finishWin(bonus) {
    if (game.ending) return;
    game.running = false;
    game.ending = true;
    cancelAnimationFrame(game.animationId);

    const finalScore = Math.max(0, Math.floor(game.score));
    stats.games += 1;
    stats.best = Math.max(stats.best, finalScore);
    stats.coins += game.runCoins;
    localStorage.setItem(STORAGE.games, String(stats.games));
    localStorage.setItem(STORAGE.best, String(stats.best));
    localStorage.setItem(STORAGE.coins, String(stats.coins));
    updateStats();
    game.finalRun = {
      score: finalScore,
      coins: game.runCoins,
      streak: game.bestStreak,
      saved: game.savedTownies
    };

    $("overlayTitle").textContent = "\u{1F31F} YOU WIN! \u{1F31F}";
    $("overlayText").textContent = `All 21 Townies escaped through the Nexus! +${bonus.toLocaleString()} bonus · Final score: ${finalScore.toLocaleString()}`;
    $("nameEntry").hidden = false;
    $("preRunInfo").hidden = true;
    $("startBtn").textContent = "Start Over";
    $("overlayLeaderboardBtn").hidden = false;
    $("overlay").classList.remove("hidden");
  }

  function collectLife(life) {
    life.collected = true;
    game.lives = Math.min(5, game.lives + 1);
    game.score += 200;
    spawnParticles(life.x + 17, life.y + 17, "\u{2764}\u{FE0F}", 8);
    showToast("\u{2764}\u{FE0F} Extra life!");
    sounds.life();
  }

  function collectPower(power) {
    power.collected = true;
    game.activePower = power;
    game.powerRemaining = power.duration;
    game.score += 150;
    spawnParticles(power.x + 18, power.y + 18, "\u{2728}", 8);
    showToast(power.label);
    sounds.power();
  }

  function endRun() {
    if (game.ending) return;
    game.running = false;
    game.ending = true;
    cancelAnimationFrame(game.animationId);

    const finalScore = Math.max(0, Math.floor(game.score));
    const newBest = finalScore > stats.best;

    stats.games += 1;
    stats.best = Math.max(stats.best, finalScore);
    stats.coins += game.runCoins;

    localStorage.setItem(STORAGE.games, String(stats.games));
    localStorage.setItem(STORAGE.best, String(stats.best));
    localStorage.setItem(STORAGE.coins, String(stats.coins));

    updateStats();
    game.finalRun = {
      score: finalScore,
      coins: game.runCoins,
      streak: game.bestStreak,
      saved: game.savedTownies
    };
    sounds.gameOver();

    $("overlayTitle").textContent = newBest ? "\u{1F31F} New Best!" : "Run Over";
    $("overlayText").textContent = `\u{2B50} ${finalScore.toLocaleString()} · \u{1F4B0} ${game.runCoins} · \u{1F525} Best ×${game.bestStreak}`;
    $("nameEntry").hidden = false;
    $("preRunInfo").hidden = true;
    $("startBtn").textContent = "Start Over";
    $("overlayLeaderboardBtn").hidden = false;
    $("overlay").classList.remove("hidden");
  }

  function update(deltaTime) {
    game.elapsed += deltaTime;
    const multiplier = game.activePower?.key === "double" ? 2 : 1;
    game.score += deltaTime * 100 * multiplier;
    const config = modeConfig();

    // Hard mode starts a little faster and gains more speed for every Townie
    // added to the crew. Easy mode keeps the gentler existing curve.
    const hardBaseBonus = game.difficulty === "hard"
      ? (game.mode === "normal" ? 20 : 25)
      : 0;

    const followerBoostMultiplier = game.difficulty === "hard" ? 1.55 : 1;
    const followerSpeedBonus =
      game.followers.length *
      config.followerSpeedBoost *
      followerBoostMultiplier;

    game.speed = Math.min(
      config.maxSpeed,
      config.baseSpeed +
      hardBaseBonus +
      game.score * config.speedGrowth +
      followerSpeedBonus
    );

    game.invulnerable = Math.max(0, game.invulnerable - deltaTime);
    game.flashTimer = Math.max(0, game.flashTimer - deltaTime);
    game.chainHitCooldown = Math.max(0, game.chainHitCooldown - deltaTime);

    if (game.activePower) {
      game.powerRemaining -= deltaTime;
      if (game.powerRemaining <= 0) {
        game.activePower = null;
        game.powerRemaining = 0;
      }
    }

    const player = game.player;

    // The leader begins at the original position, then shifts farther right
    // as the rescue line grows. This creates room for followers while also
    // reducing the player's reaction time as the run becomes more successful.
    const leaderStartX = config.playerX;
    const shiftPerFollower = config.leaderShift;
    const leaderTargetX = leaderStartX + game.followers.length * shiftPerFollower;
    player.x += (leaderTargetX - player.x) * Math.min(1, deltaTime * 5.5);

    player.velocityY += game.gravity * deltaTime;
    player.y += player.velocityY * deltaTime;
    player.onGround = false;

    let landingY = game.groundY;
    for (const platform of game.platforms) {
      const playerBottom = player.y + player.height;
      const previousBottom = playerBottom - player.velocityY * deltaTime;
      const horizontallyOver = player.x + player.width - 8 > platform.x && player.x + 8 < platform.x + platform.width;
      if (player.velocityY >= 0 && horizontallyOver && previousBottom <= platform.y + 8 && playerBottom >= platform.y) {
        landingY = Math.min(landingY, platform.y);
      }
    }

    if (player.y + player.height >= landingY) {
      player.y = landingY - player.height;
      player.velocityY = 0;
      player.onGround = true;
      player.jumped = false;
      game.airJumpsUsed = 0;
    }

    player.frameTimer += deltaTime;
    if (player.frameTimer > 0.1) {
      player.frameTimer = 0;
      player.frame = (player.frame + 1) % 4;
    }

    game.movementHistory.push({ y: player.y, frame: player.frame });
    if (game.movementHistory.length > 140) game.movementHistory.shift();

    game.spawnTimer += deltaTime;
    game.followerTimer += deltaTime;
    game.doorTimer += deltaTime;
    game.lifeTimer += deltaTime;
    game.powerTimer += deltaTime;

    if (game.spawnTimer >= game.nextSpawn) {
      game.spawnTimer = 0;
      addObstacle();
    }
    if (game.followerTimer >= game.nextFollower) {
      game.followerTimer = 0;
      addRecruitable();
    }
    if (game.doorTimer >= game.nextDoor) {
      game.doorTimer = 0;
      addDoor();
    }
    if (game.lifeTimer >= game.nextLife) {
      game.lifeTimer = 0;
      addExtraLife();
    }
    if (game.powerTimer >= game.nextPower) {
      game.powerTimer = 0;
      addPower();
    }

    const movingGroups = [game.obstacles, game.coins, game.platforms, game.recruitables, game.doors, game.extraLives, game.powers];
    movingGroups.forEach((group) => group.forEach((item) => { item.x -= game.speed * deltaTime; }));

    game.coins.forEach((coin) => {
      coin.bob += deltaTime * 5;
      if (game.activePower?.key === "magnet" && coin.x < player.x + 300 && coin.x > player.x - 60) {
        coin.x += (player.x - coin.x) * deltaTime * 4;
        coin.y += (player.y + 18 - coin.y) * deltaTime * 4;
      }
      if (!coin.collected && crewOverlaps(coin, 3)) {
        collectCoin(coin);
        return;
      }

      // Reset the musical streak only after a coin has passed the whole crew.
      if (!coin.collected && !coin.missed) {
        const leftmostCrewX = Math.min(...crewRects().map((member) => member.x));
        if (coin.x + coin.width < leftmostCrewX - 8) {
          coin.missed = true;
          if (game.streak > 0) {
            game.streak = 0;
            showToast("\u{1F4B0} Coin missed — streak reset");
          }
        }
      }
    });

    game.obstacles.forEach((obstacle) => {
      if (!obstacle.cleared && obstacle.x + obstacle.width < player.x) {
        obstacle.cleared = true;
        if (player.jumped || player.y + player.height < game.groundY - 10) {
          game.streak += 1;
          game.bestStreak = Math.max(game.bestStreak, game.streak);
          game.score += 50 + game.streak * 8;
        }
      }
      handleObstacleCollision(obstacle);
    });

    game.recruitables.forEach((recruit) => {
      recruit.frameTimer += deltaTime;
      if (recruit.frameTimer > 0.09) {
        recruit.frameTimer = 0;
        recruit.frame = (recruit.frame + 1) % 4;
      }

      if (!recruit.collected) {
        const localSpeed = recruit.runSpeed || 0;
        const direction = recruit.direction || 1;
        recruit.x += direction * localSpeed * deltaTime;

        if (recruit.platform && !recruit.airborne) {
          const leftEdge = recruit.platform.x + 6 * config.scale;
          const rightEdge = recruit.platform.x + recruit.platform.width - recruit.width - 6 * config.scale;

          const reachedLeft = recruit.x <= leftEdge;
          const reachedRight = recruit.x >= rightEdge;

          if (reachedLeft || reachedRight) {
            const movingOffEdge =
              (reachedLeft && recruit.direction < 0) ||
              (reachedRight && recruit.direction > 0);

            if (movingOffEdge && recruit.leavePlatform) {
              // Let this Townie run right off the edge and fall to a lower
              // platform or the ground instead of always turning around.
              recruit.platform = null;
              recruit.airborne = true;
              recruit.velocityY = 0;
              recruit.leavePlatform = false;
            } else {
              recruit.x = reachedLeft ? leftEdge : rightEdge;
              recruit.direction *= -1;

              // Give each edge another small chance of becoming an exit next
              // time around so Townies don't remain trapped forever.
              if (chance(0.28)) recruit.leavePlatform = true;
            }
          }

          if (recruit.platform) {
            recruit.y = recruit.platform.y - recruit.height;
          }
        }

        if (recruit.airborne) {
          recruit.velocityY += game.gravity * 0.82 * deltaTime;
          recruit.y += recruit.velocityY * deltaTime;

          let landingY = game.groundY;
          let landingPlatform = null;

          game.platforms.forEach((platform) => {
            const townieBottom = recruit.y + recruit.height;
            const previousBottom = townieBottom - recruit.velocityY * deltaTime;
            const overPlatform =
              recruit.x + recruit.width - 6 > platform.x &&
              recruit.x + 6 < platform.x + platform.width;

            if (
              recruit.velocityY >= 0 &&
              overPlatform &&
              previousBottom <= platform.y + 8 &&
              townieBottom >= platform.y &&
              platform.y < landingY
            ) {
              landingY = platform.y;
              landingPlatform = platform;
            }
          });

          if (recruit.y + recruit.height >= landingY) {
            recruit.y = landingY - recruit.height;
            recruit.velocityY = 0;
            recruit.airborne = false;
            recruit.platform = landingPlatform;
            recruit.leavePlatform = landingPlatform ? chance(0.38) : false;
          }
        }
      }

      if (!recruit.collected && crewOverlaps(recruit, 4)) {
        recruit.collected = true;
        recruitTownie(recruit);
      }
    });

    game.doors.forEach((door) => {
      door.pulse += deltaTime * 5;
      door.cooldown = Math.max(0, (door.cooldown || 0) - deltaTime);
      if (!door.used && crewOverlaps(door, 4)) enterDoor(door);
    });

    game.extraLives.forEach((life) => {
      life.bob += deltaTime * 5;
      if (!life.collected && crewOverlaps(life, 2)) collectLife(life);
    });

    game.powers.forEach((power) => {
      power.bob += deltaTime * 5;
      if (!power.collected && crewOverlaps(power, 2)) collectPower(power);
    });

    game.particles.forEach((particle) => {
      particle.life -= deltaTime;
      particle.vy += 260 * deltaTime;
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
    });

    game.obstacles = game.obstacles.filter((item) => item.x + item.width > -80);
    game.coins = game.coins.filter((item) => !item.collected && item.x + item.width > -80);
    game.platforms = game.platforms.filter((item) => item.x + item.width > -80);
    game.recruitables = game.recruitables.filter((item) => !item.collected && item.x + item.width > -80);
    game.doors = game.doors.filter((item) => !item.used && item.x + item.width > -80);
    game.extraLives = game.extraLives.filter((item) => !item.collected && item.x + item.width > -80);
    game.powers = game.powers.filter((item) => !item.collected && item.x + item.width > -80);
    game.particles = game.particles.filter((item) => item.life > 0);

    updateHud();
  }

  function drawBackground() {
    const env = environments[game.environmentIndex];
    const width = canvas.width;
    const height = canvas.height;
    const horizon = clamp(game.groundY / height, 0.45, 0.88);
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, env.sky1);
    sky.addColorStop(Math.max(0.2, horizon - 0.08), env.sky2);
    sky.addColorStop(Math.max(0.21, horizon - 0.07), env.horizon);
    sky.addColorStop(1, env.ground);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const moonRadius = Math.min(width, height) * (game.mode === "normal" ? 0.07 : 0.115);
    ctx.fillStyle = "#ffe3a0";
    ctx.beginPath();
    ctx.arc(width * 0.82, height * (game.mode === "normal" ? 0.14 : 0.22), moonRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    const offset = (game.elapsed * game.speed * 0.025) % width;
    const stars = [[.10,.12],[.20,.24],[.31,.08],[.44,.19],[.57,.07],[.69,.28],[.83,.11],[.93,.31],[.15,.43],[.53,.37],[.76,.48]];
    stars.forEach(([nx, ny]) => {
      const x = ((nx * width) - offset + width) % width;
      const y = ny * Math.min(game.groundY, height * 0.8);
      ctx.fillRect(x, y, game.mode === "normal" ? 3 : 2, game.mode === "normal" ? 3 : 2);
    });

    if (game.mode === "normal") {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = env.accent;
      ctx.beginPath();
      ctx.moveTo(0, game.groundY - 72);
      for (let x = 0; x <= width; x += 90) {
        ctx.lineTo(x, game.groundY - 72 - Math.sin((x / width) * Math.PI * 4) * 24);
      }
      ctx.lineTo(width, game.groundY);
      ctx.lineTo(0, game.groundY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.strokeStyle = env.accent;
    ctx.lineWidth = game.mode === "normal" ? 5 : 4;
    ctx.beginPath();
    ctx.moveTo(0, game.groundY + 2);
    ctx.lineTo(width, game.groundY + 2);
    ctx.stroke();
  }

  function drawTownie(imageIndex, x, y, width, height, frame, alpha = 1, mirror = false) {
    const image = townieImages[imageIndex] || townieImages[0];
    ctx.save();
    ctx.globalAlpha = alpha;
    if (image?.ready) {
      const sheet = image.naturalWidth >= 128 && image.naturalHeight >= 64;
      if (mirror) {
        ctx.translate(x + width, 0);
        ctx.scale(-1, 1);
        if (sheet) ctx.drawImage(image, frame * 32, 32, 32, 32, 0, y, width, height);
        else ctx.drawImage(image, 0, y, width, height);
      } else {
        if (sheet) ctx.drawImage(image, frame * 32, 32, 32, 32, x, y, width, height);
        else ctx.drawImage(image, x, y, width, height);
      }
    } else {
      ctx.fillStyle = `hsl(${(imageIndex * 47) % 360} 75% 58%)`;
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = "#111";
      ctx.fillText(String(imageIndex + 1), x + width / 2 - 4, y + height / 2 + 4);
    }
    ctx.restore();
  }

  function drawObstacle(obstacle) {
    if (obstacle.type === "drone") {
      const pulse = 0.65 + Math.sin(game.elapsed * 12 + obstacle.x * 0.03) * 0.35;
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(255, 48, 74, ${pulse})`;

      // Angular red hazard body—deliberately unlike the flat cyan platforms.
      ctx.fillStyle = "#300913";
      ctx.strokeStyle = "#ff304a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(obstacle.x + 8, obstacle.y + 5);
      ctx.lineTo(obstacle.x + obstacle.width - 8, obstacle.y + 5);
      ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2);
      ctx.lineTo(obstacle.x + obstacle.width - 8, obstacle.y + obstacle.height - 5);
      ctx.lineTo(obstacle.x + 8, obstacle.y + obstacle.height - 5);
      ctx.lineTo(obstacle.x, obstacle.y + obstacle.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Warning stripe and pulsing danger lights.
      ctx.fillStyle = "#ffd13d";
      for (let x = obstacle.x + 10; x < obstacle.x + obstacle.width - 8; x += 12) {
        ctx.save();
        ctx.translate(x, obstacle.y + 12);
        ctx.rotate(-0.55);
        ctx.fillRect(0, 0, 5, 14);
        ctx.restore();
      }
      ctx.fillStyle = `rgba(255, 48, 74, ${pulse})`;
      ctx.beginPath();
      ctx.arc(obstacle.x + 9, obstacle.y + obstacle.height / 2, 4, 0, Math.PI * 2);
      ctx.arc(obstacle.x + obstacle.width - 9, obstacle.y + obstacle.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Downward spikes make the silhouette unmistakably dangerous.
      ctx.fillStyle = "#ff304a";
      for (let x = obstacle.x + 8; x < obstacle.x + obstacle.width - 4; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, obstacle.y + obstacle.height - 4);
        ctx.lineTo(x + 6, obstacle.y + obstacle.height + 8);
        ctx.lineTo(x + 12, obstacle.y + obstacle.height - 4);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = obstacle.type === "crystal" ? "#552a75" : "#27131f";
    ctx.beginPath();
    ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
    ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
    ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = obstacle.type === "crystal" ? "#61f5ff" : "#ff4fd8";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function draw() {
    drawBackground();

    game.platforms.forEach((platform) => {
      ctx.fillStyle = "#2a3150";
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      ctx.fillStyle = "#61f5ff";
      ctx.fillRect(platform.x, platform.y, platform.width, 3);
    });

    game.coins.forEach((coin) => {
      const y = coin.y + Math.sin(coin.bob) * 4;
      const cx = coin.x + coin.width / 2;
      const cy = y + coin.height / 2;
      ctx.save();
      ctx.shadowBlur = 9;
      ctx.shadowColor = "#ffd84d";
      ctx.fillStyle = "#f7b928";
      ctx.strokeStyle = "#fff29a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 11 * modeConfig().scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#7b4b00";
      ctx.font = `bold ${13 * modeConfig().scale}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("₿", cx, cy + 1);
      ctx.restore();
    });

    game.extraLives.forEach((life) => {
      ctx.font = `${30 * modeConfig().scale}px Arial`;
      ctx.fillText("\u{2764}\u{FE0F}", life.x, life.y + Math.sin(life.bob) * 4 * modeConfig().scale + 29 * modeConfig().scale);
    });

    game.powers.forEach((power) => {
      const icon = power.key === "shield"
        ? "\u{1F6E1}\u{FE0F}"
        : power.key === "magnet"
          ? "\u{1F9F2}"
          : power.key === "doubleJump"
            ? "\u{1F46F}"
            : "\u{26A1}";
      ctx.font = `${30 * modeConfig().scale}px Arial`;
      ctx.fillText(icon, power.x, power.y + Math.sin(power.bob) * 4 * modeConfig().scale + 29 * modeConfig().scale);
    });

    game.doors.forEach((door) => {
      const glow = 8 + Math.sin(door.pulse) * 4;
      ctx.shadowBlur = glow;
      ctx.shadowColor = "#ff9d20";
      ctx.fillStyle = "#502656";
      ctx.fillRect(door.x, door.y, door.width, door.height);
      ctx.fillStyle = "#12091a";
      ctx.fillRect(door.x + 10, door.y + 12, door.width - 20, door.height - 12);
      ctx.font = `${28 * modeConfig().scale}px Arial`;
      ctx.fillText("\u{1F6AA}", door.x + 14 * modeConfig().scale, door.y + 51 * modeConfig().scale);
      ctx.shadowBlur = 0;
    });

    game.obstacles.forEach(drawObstacle);

    game.recruitables.forEach((recruit) => {
      drawTownie(
        recruit.townieIndex,
        recruit.x,
        recruit.y,
        recruit.width,
        recruit.height,
        recruit.frame,
        1,
        recruit.direction < 0
      );
      ctx.font = `${17 * modeConfig().scale}px Arial`;
      ctx.fillText("\u{2757}", recruit.x + 13 * modeConfig().scale, recruit.y - 8 * modeConfig().scale);
    });

    if (!game.won) {
      game.followers.forEach((follower, index) => {
        const position = followerPosition(index);
        drawTownie(follower.townieIndex, position.x, position.y, position.width, position.height, position.frame, 0.94);
      });

      const blink = game.invulnerable > 0 && Math.floor(game.invulnerable * 10) % 2 === 0;
      if (!blink) drawTownie(0, game.player.x, game.player.y - 2, game.player.width, game.player.height, game.player.frame);
    }

    game.particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = clamp(particle.life * 2, 0, 1);
      ctx.font = "18px Arial";
      ctx.fillText(particle.symbol, particle.x, particle.y);
      ctx.restore();
    });

    if (game.flashTimer > 0) {
      const alpha = clamp(game.flashTimer * 1.5, 0, 0.42);
      ctx.save();
      ctx.strokeStyle = `rgba(255, 50, 80, ${alpha})`;
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
      ctx.restore();
    }
  }

  function gameLoop(now) {
    if (!game.running) return;

    if (!game.lastTime) {
      game.lastTime = now;
      game.animationId = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = clamp((now - game.lastTime) / 1000, 0, 0.033);
    game.lastTime = now;

    update(deltaTime);
    draw();

    if (game.running) game.animationId = requestAnimationFrame(gameLoop);
  }

  const homeTownieCanvas = $("homeTownieCanvas");
  const homeTownieContext = homeTownieCanvas?.getContext("2d");
  if (homeTownieContext) homeTownieContext.imageSmoothingEnabled = false;

  const decorativeSprites = {
    frame: 0,
    lastFrameTime: 0,
    animationId: 0,
    leaderboardCanvases: new Set()
  };

  function drawExactSprite(context, image, frame, row, width, height, mirror = false) {
    context.clearRect(0, 0, width, height);

    if (!image || !image.ready) {
      context.save();
      if (mirror) {
        context.translate(width, 0);
        context.scale(-1, 1);
      }
      context.fillStyle = "#ff9d20";
      context.fillRect(7, 5, width - 14, height - 8);
      context.restore();
      return;
    }

    context.save();
    if (mirror) {
      context.translate(width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(
      image,
      frame * 32,
      row * 32,
      32,
      32,
      0,
      0,
      width,
      height
    );
    context.restore();
  }

  function animateDecorativeSprites(now) {
    if (!decorativeSprites.lastFrameTime) decorativeSprites.lastFrameTime = now;

    if (now - decorativeSprites.lastFrameTime >= 140) {
      decorativeSprites.frame = (decorativeSprites.frame + 1) % 4;
      decorativeSprites.lastFrameTime = now;
    }

    if (homeTownieContext && $("homePage").classList.contains("visible")) {
      // Row 7 is walk_down: 6 attack rows/sections before it, 32px per row.
      drawExactSprite(homeTownieContext, townieImages[0], decorativeSprites.frame, 7, 96, 96, false);
    }

    decorativeSprites.leaderboardCanvases.forEach((canvasElement) => {
      if (!canvasElement.isConnected) {
        decorativeSprites.leaderboardCanvases.delete(canvasElement);
        return;
      }

      const context = canvasElement.getContext("2d");
      context.imageSmoothingEnabled = false;
      const townieIndex = Number(canvasElement.dataset.townieIndex) || 0;
      const mirror = canvasElement.dataset.mirror === "true";
      // Row 1 is walk_right. Left movement mirrors those same four frames.
      drawExactSprite(context, townieImages[townieIndex], decorativeSprites.frame, 1, 48, 48, mirror);
    });

    decorativeSprites.animationId = requestAnimationFrame(animateDecorativeSprites);
  }

  let homeTypingTimer = 0;
  let homeTypingRun = 0;

  function startHomeTyping() {
    window.clearTimeout(homeTypingTimer);
    homeTypingRun += 1;
    const runId = homeTypingRun;
    const lines = [...document.querySelectorAll("#homeRules [data-rule]")];
    lines.forEach((line) => {
      line.textContent = "";
      line.classList.remove("typing");

      if (line.dataset.icon === "bitcoin") {
        const icon = document.createElement("span");
        icon.className = "mission-bitcoin-coin";
        icon.textContent = "₿";
        icon.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.className = "mission-rule-text";

        line.append(icon, text);
      }
    });

    let lineIndex = 0;
    let characterIndex = 0;

    function typeNext() {
      if (runId !== homeTypingRun || !$("homePage").classList.contains("visible")) return;
      const line = lines[lineIndex];
      if (!line) return;
      const text = line.dataset.rule || "";
      const textTarget = line.querySelector(".mission-rule-text") || line;
      line.classList.add("typing");

      if (characterIndex < text.length) {
        textTarget.textContent += text[characterIndex];
        characterIndex += 1;
        homeTypingTimer = window.setTimeout(typeNext, 24);
        return;
      }

      line.classList.remove("typing");
      lineIndex += 1;
      characterIndex = 0;
      if (lineIndex < lines.length) homeTypingTimer = window.setTimeout(typeNext, 260);
    }

    homeTypingTimer = window.setTimeout(typeNext, 220);
  }

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("visible", page.id === pageId);
  });

  if (pageId === "leaderboardPage") {
    homeTypingRun += 1;
    window.clearTimeout(homeTypingTimer);
    renderLeaderboard();
    scheduleLeaderboardRunner(true);
  } else if (pageId === "homePage") {
    clearTimeout(leaderboardRunnerTimer);

    if (activeLeaderboardCrew) {
      activeLeaderboardCrew.remove();
      activeLeaderboardCrew = null;
    }

    $("leaderboardRunnerStage")
      ?.querySelectorAll(".lb-crew")
      .forEach((crew) => crew.remove());

    startHomeTyping();
    if (window.matchMedia("(max-width: 700px)").matches) {
      setMobileSetupExpanded(false);
    }
  }
}
  let leaderboardRunnerTimer = 0;
let activeLeaderboardCrew = null;

function scheduleLeaderboardRunner(immediate = false) {
  clearTimeout(leaderboardRunnerTimer);

  const delay = immediate
    ? rand(4500, 9000)
    : rand(18000, 38000);

  leaderboardRunnerTimer = setTimeout(() => {
    if (!$("leaderboardPage").classList.contains("visible")) {
      return;
    }

    // Do not spawn another crew while one is still running.
    if (activeLeaderboardCrew?.isConnected) {
      scheduleLeaderboardRunner(false);
      return;
    }

    const stage = $("leaderboardRunnerStage");

    // Remove any crew accidentally left behind.
    stage.querySelectorAll(".lb-crew").forEach((crew) => crew.remove());

    const crew = document.createElement("div");
    activeLeaderboardCrew = crew;

    const followerCount = Math.floor(rand(0, 21));
    const direction = chance(0.5) ? "to-right" : "to-left";

    const availableTownies = Array.from(
      { length: 20 },
      (_, index) => index + 2
    );

    for (let i = availableTownies.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));

      [availableTownies[i], availableTownies[j]] = [
        availableTownies[j],
        availableTownies[i]
      ];
    }

    // Townie 1 is always the leader.
    const imageNumbers = [
      1,
      ...availableTownies.slice(0, followerCount)
    ];

    const crewWidth =
      48 + Math.max(0, imageNumbers.length - 1) * 35;

    crew.className = `lb-crew ${direction}`;
    crew.style.setProperty("--crew-width", `${crewWidth}px`);
    crew.style.animationDuration = `${rand(5.2, 8.2)}s`;

    imageNumbers.forEach((imageNumber) => {
      const townie = document.createElement("canvas");

      townie.className = "lb-townie";
      townie.width = 48;
      townie.height = 48;
      townie.dataset.townieIndex = String(imageNumber - 1);
      townie.dataset.mirror =
        direction === "to-left" ? "true" : "false";

      decorativeSprites.leaderboardCanvases.add(townie);
      crew.appendChild(townie);
    });

    stage.appendChild(crew);

    crew.addEventListener(
      "animationend",
      () => {
        crew.remove();

        if (activeLeaderboardCrew === crew) {
          activeLeaderboardCrew = null;
        }

        // Begin waiting for the next crew only after this one disappears.
        if ($("leaderboardPage").classList.contains("visible")) {
          scheduleLeaderboardRunner(false);
        }
      },
      { once: true }
    );
  }, delay);
}
  $("easyDifficultyBtn").addEventListener("click", () => {
    if (!game.running) {
      applyDifficulty("easy");
    }
  });

  $("hardDifficultyBtn").addEventListener("click", () => {
    if (!game.running) {
      applyDifficulty("hard");
    }
  });

  $("mobileSetupToggle")?.addEventListener("click", () => {
    const expanded = $("mobileSetupToggle").getAttribute("aria-expanded") === "true";
    setMobileSetupExpanded(!expanded);
  });

  $("normalModeBtn").addEventListener("click", () => {
    if (!game.running) {
      applyMode("normal");
      resetGame();
    }
  });

  $("landscapeModeBtn").addEventListener("click", () => {
    if (!game.running) {
      applyMode("landscape");
      resetGame();
    }
  });

  $("playBtn").addEventListener("click", openGame);
  $("leaderboardPlayBtn").addEventListener("click", openGame);
  $("homeLeaderboardBtn").addEventListener("click", () => showPage("leaderboardPage"));
  $("leaderboardHomeBtn").addEventListener("click", () => showPage("homePage"));
  $("overlayLeaderboardBtn").addEventListener("click", () => {
    commitFinishedRun();
    closeGame();
    showPage("leaderboardPage");
  });
  $("closeBtn").addEventListener("click", closeGame);
  $("startBtn").addEventListener("click", () => {
    if (game.ending) commitFinishedRun();
    startGame();
  });
  canvas.addEventListener("pointerdown", jump);

  window.addEventListener("keydown", (event) => {
    const typingInField = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
    if (typingInField) {
      if (!game.running && event.code === "Enter") { event.preventDefault(); startGame(); }
      return;
    }
    if (dialog.hidden) {
      if ((event.code === "Space" || event.code === "Enter") && $("homePage").classList.contains("visible")) {
        event.preventDefault();
        openGame();
      }
      return;
    }
    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "Enter") {
      event.preventDefault();
      game.running ? jump() : startGame();
    }
  });

  updateStats();
  renderLeaderboard();
  applyDifficulty(initialDifficulty, false);
  applyMode(initialMode, false);
  updateMobileSetupSummary();
  if (window.matchMedia("(max-width: 700px)").matches) {
    setMobileSetupExpanded(false);
  }
  resetGame();
  decorativeSprites.animationId = requestAnimationFrame(animateDecorativeSprites);
  startHomeTyping();
})();
