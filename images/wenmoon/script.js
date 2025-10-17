// ====== Wenmoon Brainometer — BG + Face + Brain + timeframe + pulse/tremor ======
// Max timeframe now = % from ATH, and we DISPLAY the ATH price + date explicitly.

// ---------- Adaptive refresh settings ----------
const REFRESH_BY_TF = {
  "24h": 60_000,   // 1 min
  "7d":  120_000,  // 2 min
  "30d": 300_000,  // 5 min
  "1y":  600_000,  // 10 min
  "max": 600_000   // 10 min (ATH mode)
};
const HIDDEN_MULTIPLIER = 3; // Slow down when tab not visible

// ---------- Backgrounds ----------
const BACKGROUNDS = {
  positive: "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/bg-positive.png",
  neutral:  "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/bg-neutral.png",
  negative: "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/bg-negative.png"
};
function pickBackground(pct) {
  if (!Number.isFinite(pct)) return BACKGROUNDS.neutral;
  if (pct > 0.25)  return BACKGROUNDS.positive;
  if (pct < -0.25) return BACKGROUNDS.negative;
  return BACKGROUNDS.neutral;
}

// ---------- DOM ----------
const form       = document.getElementById("form");
const presetId   = document.getElementById("presetId");
const customWrap = document.getElementById("customWrap");
const customId   = document.getElementById("customId");
const vsCurrency = document.getElementById("vsCurrency");
const timeframe  = document.getElementById("timeframe");

const assetOut   = document.getElementById("assetOut");
const priceOut   = document.getElementById("priceOut");
const changeOut  = document.getElementById("changeOut");
const timeOut    = document.getElementById("timeOut");

// Optional: show ATH line if present (add <div id="athOut"></div> next to readout in HTML if you want)
let athOut = document.getElementById("athOut");
if (!athOut) {
  // If not present, create it after changeOut for clarity
  const readout = changeOut.parentElement?.parentElement || document.body;
  athOut = document.createElement("div");
  athOut.style.marginTop = "4px";
  athOut.style.color = "#9aa0a6";
  readout.appendChild(athOut);
}

const imageWrap  = document.querySelector(".image-wrap");
const bgImg      = document.getElementById("bgImg");
const faceImg    = document.getElementById("faceImg");
const brainImg   = document.getElementById("brainImg");

let timer = null;
  
// Create an inner glow layer (between bg and face) if it doesn't exist
let innerGlow = document.getElementById("innerGlow");
if (!innerGlow) {
  innerGlow = document.createElement("div");
  innerGlow.id = "innerGlow";
  innerGlow.className = "inner-glow";
  const wrap = document.querySelector(".image-wrap");
  const faceEl = document.getElementById("faceImg");
  wrap.insertBefore(innerGlow, faceEl); // <— guarantees correct order
}

// Show custom ID input when needed
presetId.addEventListener("change", () => {
  customWrap.style.display = presetId.value === "custom" ? "" : "none";
});

// ---------- Brain mapping (your spec) ----------
function pickBrainOverlay(pct) {
  if (!Number.isFinite(pct)) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";

  // NEGATIVE
  if (pct <= -100) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-1.png";            // (-∞, -100%]
  if (pct <= -20)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-2.png";            // (-100%, -20%]
  if (pct < 0)     return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-neg.png";  // (-20%, 0)

  // EXACT ZERO -> positive neutral
  if (pct === 0)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";  // 0%

  // POSITIVE
  if (pct <= 20)    return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png"; // (0, 20%]
  if (pct <= 50)    return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-4.png";           // (20%, 50%]
  if (pct <= 100)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-5.png";           // (50%, 100%]
  if (pct <= 200)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-1.png";           // (100%, 200%]
  if (pct <= 300)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-2.png";           // (200%, 300%]
  if (pct <= 400)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-3.png";           // (300%, 400%]
  if (pct <= 500)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-4.png";           // (400%, 500%]
  if (pct <= 888)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-5.png";           // (500%, 888%]
  if (pct <= 1000)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-1.png";           // (888%, 1000%]
  if (pct <= 1500)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-2.png";           // (1000%, 1500%]
  if (pct <= 2000)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-3.png";           // (1500%, 2000%]
  if (pct <= 2500)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-4.png";           // (2000%, 2500%]
  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-5.png";                              // (2500%, ∞)
}

// ---------- Formatting ----------
function fmtCurrency(value, code) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code.toUpperCase() }).format(value);
  } catch {
    return `${value?.toFixed?.(2) ?? value} ${code.toUpperCase()}`;
  }
}
function fmtPct(p) {
  const sign = p > 0 ? "+" : "";
  return `${sign}${Number(p).toFixed(2)}%`;
}
function fmtDateISO(s) {
  try {
    const d = new Date(s);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0,10);
  } catch { return ""; }
}

// ---------- Fetch helper (retry + proxy fallback) ----------
async function fetchJSON(url, { retries = 2, backoffMs = 400 } = {}) {
  async function tryOnce(u) {
    const r = await fetch(u, { headers: { accept: "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  // Direct tries
  for (let i = 0; i <= retries; i++) {
    try { return await tryOnce(url); }
    catch (e) { if (i === retries) break; await new Promise(res => setTimeout(res, backoffMs * (i + 1))); }
  }
  // Proxy fallback
  const proxied = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  for (let i = 0; i <= retries; i++) {
    try { return await tryOnce(proxied); }
    catch (e) { if (i === retries) throw e; await new Promise(res => setTimeout(res, backoffMs * (i + 1))); }
  }
}

// ---------- Data fetchers ----------
async function getChange24h(id, vs) {
  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${encodeURIComponent(id)}&vs_currencies=${encodeURIComponent(vs)}` +
    `&include_24hr_change=true`;
  const data = await fetchJSON(url);
  const row = data?.[id];
  if (!row) throw new Error("Asset not found");
  return { price: Number(row[vs]), pct: Number(row[`${vs}_24h_change`]) };
}

async function getChangeMulti(id, vs, windowKey) {
  const wanted = ["7d", "30d", "1y"].includes(windowKey) ? windowKey : "7d";
  const url =
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vs)}` +
    `&ids=${encodeURIComponent(id)}&order=market_cap_desc&per_page=1&page=1&sparkline=false` +
    `&price_change_percentage=7d,30d,1y`;
  const arr = await fetchJSON(url);
  if (!arr?.length) throw new Error("Asset not found");
  const row = arr[0];
  const price = Number(row.current_price);
  const map = {
    "7d":  Number(row.price_change_percentage_7d_in_currency),
    "30d": Number(row.price_change_percentage_30d_in_currency),
    "1y":  Number(row.price_change_percentage_1y_in_currency)
  };
  return { price, pct: map[wanted] };
}

// ATH mode: % from ATH and expose ATH price/date too
async function getChangeATH(id, vs) {
  const url =
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vs)}` +
    `&ids=${encodeURIComponent(id)}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
  const arr = await fetchJSON(url);
  if (!arr?.length) throw new Error("Asset not found");
  const row = arr[0];
  return {
    price: Number(row.current_price),
    pct: Number(row.ath_change_percentage), // % from ATH (negative means below ATH)
    athPrice: Number(row.ath),
    athDate: row.ath_date // ISO string
  };
}

// Unified getter
async function getPriceAndPct(id, vs, tf) {
  if (tf === "24h") return await getChange24h(id, vs);
  if (tf === "7d" || tf === "30d" || tf === "1y") return await getChangeMulti(id, vs, tf);
  if (tf === "max") return await getChangeATH(id, vs); // Max => vs ATH
  return await getChange24h(id, vs);
}

// ---------- Effects ----------
function applyEffects(pct) {
  imageWrap.classList.remove("pulse-green", "tremor-red");
  if (pct > 20) {
    imageWrap.classList.add("pulse-green");
  } else if (pct < -20) {
    imageWrap.classList.add("tremor-red");
  }
}

// ---------- Refresh helpers ----------
function getCurrentIntervalMs() {
  const tf = timeframe.value || "24h";
  const base = REFRESH_BY_TF[tf] ?? 60_000;
  return document.hidden ? base * HIDDEN_MULTIPLIER : base;
}
function restartTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(updateOnce, getCurrentIntervalMs());
}
document.addEventListener("visibilitychange", restartTimer);

// ---------- Main update ----------
async function updateOnce() {
  const isCustom = presetId.value === "custom";
  const id = (isCustom ? customId.value : presetId.value).trim().toLowerCase();
  const vs = vsCurrency.value;
  const tf = timeframe.value;

  if (!id) {
    changeOut.textContent = "Enter a CoinGecko ID";
    return;
  }

  try {
    const res = await getPriceAndPct(id, vs, tf);
    const price = res.price;
    const pct   = res.pct;

    const tfLabel = tf === "max" ? "ATH" : tf;
    assetOut.textContent = `${id} (${tfLabel})`;
    priceOut.textContent = Number.isFinite(price) ? fmtCurrency(price, vs) : "—";
    changeOut.textContent = fmtPct(pct);
    timeOut.textContent   = new Date().toLocaleTimeString();

    // Show ATH details when in ATH mode
    if (tf === "max" && Number.isFinite(res.athPrice)) {
      const when = fmtDateISO(res.athDate);
      athOut.textContent = `ATH: ${fmtCurrency(res.athPrice, vs)}${when ? ` on ${when}` : ""}`;
    } else {
      athOut.textContent = "";
    }

    // Background
    const nextBg = pickBackground(pct);
    if (bgImg.dataset.current !== nextBg) {
      bgImg.style.opacity = 0;
      setTimeout(() => {
        bgImg.src = nextBg;
        bgImg.dataset.current = nextBg;
        bgImg.style.opacity = 1;
      }, 180);
    }

    // Face constant (only transform)
    if (!faceImg.dataset.locked) faceImg.dataset.locked = "1";

    // Brain overlay + scale
    const newBrain = pickBrainOverlay(pct);
    brainImg.style.opacity = 0;
    setTimeout(() => {
      brainImg.src = newBrain;
      const scale = Math.max(0.95, 1 + pct / 200);
      faceImg.style.transform  = `scale(${scale})`;
      brainImg.style.transform = `scale(${scale})`;
      brainImg.style.opacity = 1;
      applyEffects(pct);
    }, 220);

  } catch (err) {
    console.error(err);
    changeOut.textContent = "Error fetching data";
    athOut.textContent = "";
    timeOut.textContent = new Date().toLocaleTimeString();

    imageWrap.classList.remove("pulse-green", "tremor-red");
    faceImg.style.transform  = "scale(1)";
    brainImg.style.transform = "scale(1)";

    if (!bgImg.dataset.current) {
      bgImg.src = BACKGROUNDS.neutral;
      bgImg.dataset.current = BACKGROUNDS.neutral;
    }
    brainImg.src = "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";
  }
}

// ---------- Start / refresh ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateOnce();
  restartTimer();
});
timeframe.addEventListener("change", () => { updateOnce(); restartTimer(); });
vsCurrency.addEventListener("change", () => { updateOnce(); restartTimer(); });
presetId.addEventListener("change", () => { updateOnce(); restartTimer(); });
if (customId) customId.addEventListener("change", () => { updateOnce(); restartTimer(); });

// Initial run
updateOnce();
restartTimer();
