// ====== Wenmoon Dynamic Price Checker ======

const REFRESH_BY_TF = { "24h": 60_000, "7d": 120_000, "30d": 300_000, "1y": 600_000, "max": 600_000 };
const HIDDEN_MULTIPLIER = 3;

const BACKGROUNDS = {
  positive: "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/bg-positive.png",
  neutral:  "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/bg-neutral.png",
  negative: "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/bg-negative.png"
};
function pickBackground(pct){ if(!Number.isFinite(pct))return BACKGROUNDS.neutral; if(pct>0.99)return BACKGROUNDS.positive; if(pct<-0.99)return BACKGROUNDS.negative; return BACKGROUNDS.neutral; }

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

// Ensure athOut exists (in HUD now)
let athOut = document.getElementById("athOut");
if (!athOut) {
  const readoutHost = document.querySelector(".hud") || document.body;
  athOut = document.createElement("div");
  athOut.id = "athOut";
  athOut.className = "ath-line";
  readoutHost.appendChild(athOut);
}

const imageWrap  = document.querySelector(".image-wrap");
const bgImg      = document.getElementById("bgImg");
const faceImg    = document.getElementById("faceImg");
const brainImg   = document.getElementById("brainImg");

let timer = null;

// Insert inner glow layer if missing (below face)
let innerGlow = document.getElementById("innerGlow");
if (!innerGlow) {
  innerGlow = document.createElement("div");
  innerGlow.id = "innerGlow";
  innerGlow.className = "inner-glow";
  const faceEl = document.getElementById("faceImg");
  imageWrap.insertBefore(innerGlow, faceEl);
}

presetId.addEventListener("change", () => { customWrap.style.display = presetId.value === "custom" ? "" : "none"; });

function pickBrainOverlay(pct) {
  if (!Number.isFinite(pct)) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";
  if (pct <= -100) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-1.png";
  if (pct <= -20)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-2.png";
  if (pct < 0)     return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-neg.png";
  if (pct === 0)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";
  if (pct <= 20)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";
  if (pct <= 50)   return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-4.png";
  if (pct <= 100)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-5.png";
  if (pct <= 200)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-1.png";
  if (pct <= 300)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-2.png";
  if (pct <= 400)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-3.png";
  if (pct <= 500)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-4.png";
  if (pct <= 888)  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/gold-5.png";
  if (pct <= 1000) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-1.png";
  if (pct <= 1500) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-2.png";
  if (pct <= 2000) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-3.png";
  if (pct <= 2500) return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-4.png";
  return "https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/moon-5.png";
}

function fmtCurrency(value, code){ try{ return new Intl.NumberFormat(undefined,{style:"currency",currency:code.toUpperCase()}).format(value);}catch{ return `${value?.toFixed?.(2) ?? value} ${code.toUpperCase()}`; } }
function fmtPct(p){ const s = p>0?"+":""; return `${s}${Number(p).toFixed(2)}%`; }
function fmtDateISO(s){ try{ const d=new Date(s); if(isNaN(d)) return ""; return d.toISOString().slice(0,10);}catch{ return ""; } }

async function fetchJSON(url,{retries=2,backoffMs=400}={}) {
  async function once(u){ const r=await fetch(u,{headers:{accept:"application/json"}}); if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }
  for(let i=0;i<=retries;i++){ try{ return await once(url);}catch(e){ if(i===retries) break; await new Promise(res=>setTimeout(res, backoffMs*(i+1))); } }
  const prox=`https://corsproxy.io/?${encodeURIComponent(url)}`;
  for(let i=0;i<=retries;i++){ try{ return await once(prox);}catch(e){ if(i===retries) throw e; await new Promise(res=>setTimeout(res, backoffMs*(i+1))); } }
}

async function getChange24h(id,vs){
  const url=`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${encodeURIComponent(vs)}&include_24hr_change=true`;
  const data=await fetchJSON(url); const row=data?.[id]; if(!row) throw new Error("Asset not found");
  return { price:Number(row[vs]), pct:Number(row[`${vs}_24h_change`]) };
}
async function getChangeMulti(id,vs,win){
  const wanted=["7d","30d","1y"].includes(win)?win:"7d";
  const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vs)}&ids=${encodeURIComponent(id)}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=7d,30d,1y`;
  const arr=await fetchJSON(url); if(!arr?.length) throw new Error("Asset not found");
  const row=arr[0]; const price=Number(row.current_price);
  const map={ "7d":Number(row.price_change_percentage_7d_in_currency), "30d":Number(row.price_change_percentage_30d_in_currency), "1y":Number(row.price_change_percentage_1y_in_currency) };
  return { price, pct: map[wanted] };
}
async function getChangeATH(id,vs){
  const url=`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(vs)}&ids=${encodeURIComponent(id)}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
  const arr=await fetchJSON(url); if(!arr?.length) throw new Error("Asset not found");
  const row=arr[0];
  return { price:Number(row.current_price), pct:Number(row.ath_change_percentage), athPrice:Number(row.ath), athDate:row.ath_date };
}
async function getPriceAndPct(id,vs,tf){
  if(tf==="24h") return await getChange24h(id,vs);
  if(tf==="7d"||tf==="30d"||tf==="1y") return await getChangeMulti(id,vs,tf);
  if(tf==="max") return await getChangeATH(id,vs);
  return await getChange24h(id,vs);
}

function applyEffects(pct){
  imageWrap.classList.remove("pulse-green","tremor-red");
  if(pct>20) imageWrap.classList.add("pulse-green");
  else if(pct<-20) imageWrap.classList.add("tremor-red");
}

function getCurrentIntervalMs(){ const tf=timeframe.value||"24h"; const base=REFRESH_BY_TF[tf]??60_000; return document.hidden? base*HIDDEN_MULTIPLIER: base; }
function restartTimer(){ if(timer) clearInterval(timer); timer=setInterval(updateOnce, getCurrentIntervalMs()); }
document.addEventListener("visibilitychange", restartTimer);

async function updateOnce(){
  const isCustom=presetId.value==="custom";
  const id=(isCustom? customId.value: presetId.value).trim().toLowerCase();
  const vs=vsCurrency.value; const tf=timeframe.value;
  if(!id){ changeOut.textContent="+0.00%"; return; }

  try{
    const res=await getPriceAndPct(id,vs,tf);
    const price=res.price, pct=res.pct;
    const tfLabel=tf==="max"?"ATH":tf;
    assetOut.textContent=`${id} (${tfLabel})`;
    priceOut.textContent=Number.isFinite(price)? fmtCurrency(price,vs): "—";
    changeOut.textContent=fmtPct(pct);
    timeOut.textContent=new Date().toLocaleTimeString();

    if(tf==="max" && Number.isFinite(res.athPrice)){
      const when=fmtDateISO(res.athDate);
      athOut.textContent=`ATH: ${fmtCurrency(res.athPrice,vs)}${when? ` on ${when}`:""}`;
    }else{ athOut.textContent=""; }

    const nextBg=pickBackground(pct);
    if(bgImg.dataset.current!==nextBg){
      bgImg.style.opacity=0; setTimeout(()=>{ bgImg.src=nextBg; bgImg.dataset.current=nextBg; bgImg.style.opacity=1; },180);
    }

    if(!faceImg.dataset.locked) faceImg.dataset.locked="1";

    const newBrain=pickBrainOverlay(pct);
    brainImg.style.opacity=0;
    setTimeout(()=>{
      brainImg.src=newBrain;
      const scale=Math.max(0.95, 1 + pct/200);
      faceImg.style.transform=`scale(${scale})`;
      brainImg.style.transform=`scale(${scale})`;
      brainImg.style.opacity=1;
      applyEffects(pct);
    },220);

  }catch(err){
    console.error(err);
    changeOut.textContent="Error fetching data"; athOut.textContent=""; timeOut.textContent=new Date().toLocaleTimeString();
    imageWrap.classList.remove("pulse-green","tremor-red");
    faceImg.style.transform="scale(1)"; brainImg.style.transform="scale(1)";
    if(!bgImg.dataset.current){ bgImg.src=BACKGROUNDS.neutral; bgImg.dataset.current=BACKGROUNDS.neutral; }
    brainImg.src="https://m88nwalker.github.io/m88nlabs.github.io/images/wenmoon/pink-neutral-pos.png";
  }
}

form.addEventListener("submit",(e)=>{ e.preventDefault(); updateOnce(); restartTimer(); });
timeframe.addEventListener("change", ()=>{ updateOnce(); restartTimer(); });
vsCurrency.addEventListener("change", ()=>{ updateOnce(); restartTimer(); });
presetId.addEventListener("change", ()=>{ updateOnce(); restartTimer(); });
if(customId) customId.addEventListener("change", ()=>{ updateOnce(); restartTimer(); });

updateOnce(); restartTimer();
