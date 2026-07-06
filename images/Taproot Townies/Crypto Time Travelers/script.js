// JavaScript Document

const CONFIG = {
  startingWallet: 2000,
  loanPayout: 5000,
  loanPayback: 5500,
  loanInterestPerJump: 50,
  futureStartDate: new Date("2030-01-01T00:00:00"),
  endYear: 2075,
  maxDays: 30,
  maxLogEntries: 30
};

const TOWNIES = [
  { id:"townie1", name:"Taproot Townie #1", className:"Cool Hand", rarity:"COMMON", bio:"Unbothered, confident, and hard to shake.", traits:["Crash severity reduced slightly.","Less likely to get crushed by hard market drops."], sprite:"assets/townies/townie1.png", meta:"assets/townies/townie1.json", mod:{crashShield:.15}},
  { id:"townie2", name:"Taproot Townie #2", className:"Quantum Hacker", rarity:"RARE", bio:"Futuristic instincts. Access to rare timelines.", traits:["Higher Rare/Epic/Legendary event odds.","Slightly more chaos on every jump."], sprite:"assets/townies/townie2.png", meta:"assets/townies/townie2.json", mod:{rarityBoost:.18}},
  { id:"townie3", name:"Taproot Townie #3", className:"Bitcoin Miner", rarity:"RARE", bio:"Built for BTC. A true Maxi.", traits:["BTC pumps harder during Bitcoin events.","BTC downside reduced slightly."], sprite:"assets/townies/townie3.png", meta:"assets/townies/townie3.json", mod:{coinBoost:{BTC:1.25}, coinShield:{BTC:.15}}},
  { id:"townie4", name:"Taproot Townie #4", className:"Primitive Bull", rarity:"RARE", bio:"High-risk primitive trading instincts.", traits:["Gets one extra day.","Markets become slightly wilder."], sprite:"assets/townies/townie4.png", meta:"assets/townies/townie4.json", mod:{extraDays:1, chaosBonus:.08}},
  { id:"townie5", name:"Taproot Townie #5", className:"Crash Survivor", rarity:"RARE", bio:"Great survival instincts.", traits:["Gets $2,000 stimulus during extreme crashes.","Triggers only when portfolio gets hit hard."], sprite:"assets/townies/townie5.png", meta:"assets/townies/townie5.json", mod:{crashStimulus:2000}},
  { id:"townie6", name:"Taproot Townie #6", className:"Degen", rarity:"EPIC", bio:"The highest risk meme trader.", traits:["DOGE and PEPE moon harder.","DOGE and PEPE crash harder."], sprite:"assets/townies/townie6.png", meta:"assets/townies/townie6.json", mod:{coinVolatility:{DOGE:1.45,PEPE:1.65}}},
  { id:"townie7", name:"Taproot Townie #7", className:"Lucky Angel", rarity:"COMMON", bio:"Luck-based survivor.", traits:["Small chance to soften terrible crashes.","Slightly better good-event odds."], sprite:"assets/townies/townie7.png", meta:"assets/townies/townie7.json", mod:{luckyCrashSave:.18}},
  { id:"townie8", name:"Taproot Townie #8", className:"Loot Runner", rarity:"EPIC", bio:"Salty treasure hunter.", traits:["Can find random crypto after jumps.","Loot chance increases on Epic events."], sprite:"assets/townies/townie8.png", meta:"assets/townies/townie8.json", mod:{lootChance:.18}},
  { id:"townie9", name:"Taproot Townie #9", className:"Bitcoin Monk", rarity:"EPIC", bio:"Calm, Bitcoin first strategy.", traits:["BTC downside reduced strongly.","Meme coin upside slightly reduced."], sprite:"assets/townies/townie9.png", meta:"assets/townies/townie9.json", mod:{coinShield:{BTC:.35}, memeDampener:.85}},
  { id:"townie10", name:"Taproot Townie #10", className:"Risk Jester", rarity:"EPIC", bio:"Extremely unpredictable and unstable.", traits:["Random bonus or penalty each jump.","Can create wild portfolio swings."], sprite:"assets/townies/townie10.png", meta:"assets/townies/townie10.json", mod:{jester:.18}},
  { id:"townie11", name:"Taproot Townie #11", className:"Kingpin Trader", rarity:"LEGENDARY", bio:"Fast-start bankroll.", traits:["Starts with $20,000.","Loses one day."], sprite:"assets/townies/townie11.png", meta:"assets/townies/townie11.json", mod:{startingWallet:20000, dayPenalty:1}},
  { id:"townie12", name:"Taproot Townie #12", className:"Mars Miner", rarity:"EPIC", bio:"Great future-colony trader.", traits:["BTC, DOGE, and SOL boosted during Mars Expansion.","Mars events feel stronger."], sprite:"assets/townies/townie12.png", meta:"assets/townies/townie12.json", mod:{eraCoinBoost:{era:"Mars Expansion", coins:{BTC:1.25,DOGE:1.4,SOL:1.35}}}},
  { id:"townie13", name:"Taproot Townie #13", className:"Empire Builder", rarity:"EPIC", bio:"Balanced long-run builder.", traits:["Diversified portfolios get a bonus.","Rewards owning multiple assets."], sprite:"assets/townies/townie13.png", meta:"assets/townies/townie13.json", mod:{diversificationBonus:.04}},
  { id:"townie14", name:"Taproot Townie #14", className:"Alien Signal", rarity:"LEGENDARY", bio:"The force is strong in this one.", traits:["Legendary events slightly more likely.","Quantum and strange events hit harder."], sprite:"assets/townies/townie14.png", meta:"assets/townies/townie14.json", mod:{legendaryBoost:.012, strangeBoost:1.2}},
  { id:"townie15", name:"Taproot Townie #15", className:"Time Broker", rarity:"RARE", bio:"Debt wizardry and spicy tacos.", traits:["Can take up to 3 loans.","Loan interest reduced by 50%."], sprite:"assets/townies/townie15.png", meta:"assets/townies/townie15.json", mod:{maxLoans:3, interestMultiplier:.5, debtForgiveness:true}},
  { id:"townie16", name:"Taproot Townie #16", className:"AI Oracle", rarity:"RARE", bio:"Chaotic energy and crazy eyes.", traits:["AI events are more profitable.","Can reveal hints through market mood."], sprite:"assets/townies/townie16.png", meta:"assets/townies/townie16.json", mod:{aiBoost:1.35, chaosBonus:.1}},
  { id:"townie17", name:"Taproot Townie #17", className:"Crash Guard", rarity:"RARE", bio:"Defense-first trader.", traits:["Less likely to see hard market crashes.","Crash damage reduced."], sprite:"assets/townies/townie17.png", meta:"assets/townies/townie17.json", mod:{avoidCrash:.22, crashShield:.22}},
  { id:"townie18", name:"Taproot Townie #18", className:"Litecoin Courier", rarity:"COMMON", bio:"Old-school utility runner.", traits:["LTC moves steadier and safer.","Interest slightly reduced."], sprite:"assets/townies/townie18.png", meta:"assets/townies/townie18.json", mod:{coinShield:{LTC:.3}, interestMultiplier:.85}},
  { id:"townie19", name:"Taproot Townie #19", className:"Solana Socialite", rarity:"RARE", bio:"Social chain specialist.", traits:["SOL pumps harder during tech events.","SOL downside slightly reduced."], sprite:"assets/townies/townie19.png", meta:"assets/townies/townie19.json", mod:{coinBoost:{SOL:1.35}, coinShield:{SOL:.12}}},
  { id:"townie20", name:"Taproot Townie #20", className:"Ethereum Goblin", rarity:"RARE", bio:"Smart contract connoisseur.", traits:["ETH supply shocks hit harder.","ETH can be more volatile."], sprite:"assets/townies/townie20.png", meta:"assets/townies/townie20.json", mod:{coinBoost:{ETH:1.35}, coinVolatility:{ETH:1.2}}},
  { id:"townie21", name:"Taproot Townie #21", className:"High Roller Energy", rarity:"LEGENDARY", bio:"High-roller settlement plays.", traits:["XRP regulatory events hit harder.","Starts with small bonus cash."], sprite:"assets/townies/townie21.png", meta:"assets/townies/townie21.json", mod:{coinBoost:{XRP:1.45}, startingBonus:500}}
];

const TOWNIE_UNLOCK_MILESTONES = [
  50000,
  250000,
  1000000,
  5000000,
  25000000,
  150000000,
  1000000000,
  15000000000,
  75000000000,
  250000000000,
  1000000000000,
  5000000000000,
  25000000000000,
  125000000000000,
  700000000000000,
  1000000000000000,
  5000000000000000,
  25000000000000000,
  125000000000000000,
  999000000000000000
];

const COINS = {
  BTC:{name:"Bitcoin",coinGeckoId:"bitcoin",icon:"https://assets.coingecko.com/coins/images/1/small/bitcoin.png",min:25000,max:18000000,volatility:.2,bias:1.02},
  LTC:{name:"Litecoin",coinGeckoId:"litecoin",icon:"https://assets.coingecko.com/coins/images/2/small/litecoin.png",min:35,max:18000,volatility:.26,bias:1},
  ETH:{name:"Ethereum",coinGeckoId:"ethereum",icon:"https://assets.coingecko.com/coins/images/279/small/ethereum.png",min:800,max:1800000,volatility:.28,bias:1.02},
  SOL:{name:"Solana",coinGeckoId:"solana",icon:"https://assets.coingecko.com/coins/images/4128/small/solana.png",min:8,max:350000,volatility:.5,bias:1.03},
  DOGE:{name:"Dogecoin",coinGeckoId:"dogecoin",icon:"https://assets.coingecko.com/coins/images/5/small/dogecoin.png",min:.02,max:180,volatility:.75,bias:1.04},
  XMR:{name:"Monero",coinGeckoId:"monero",icon:"https://assets.coingecko.com/coins/images/69/small/monero_logo.png",min:80,max:120000,volatility:.38,bias:1.01},
  XRP:{name:"XRP",coinGeckoId:"ripple",icon:"https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",min:.25,max:750,volatility:.45,bias:1.01},
  PEPE:{name:"Pepe",coinGeckoId:"pepe",icon:"https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",min:.0000001,max:.42,volatility:1.05,bias:1.06}
};

const LOCATIONS = ["Neo Manhattan","Satoshi Station","Mars Mining Colony","Bitcoin Citadel","Quantum Dubai","Moon Base Alpha","New Tokyo","El Salvador Prime","Lunar Exchange","Orbit City"];

const TIMELINE_ERAS = [
  {name:"Genesis Future",start:2030,end:2034,sentiment:"Thin Liquidity",headline:"Early future markets are chaotic and thinly traded.",globalRange:[.75,1.18],coinModifiers:{}},
  {name:"Institutional Accumulation",start:2035,end:2042,sentiment:"Mixed",headline:"Global funds quietly accumulate major crypto assets.",globalRange:[.7,1.45],coinModifiers:{BTC:[.9,1.45],ETH:[.85,1.35],XRP:[.75,1.4]}},
  {name:"AI Finance Boom",start:2043,end:2050,sentiment:"Volatile",headline:"Autonomous AI funds flood on-chain markets.",globalRange:[.55,1.85],coinModifiers:{ETH:[.75,1.7],SOL:[.65,2.1],PEPE:[.35,2.6]}},
  {name:"Privacy Wars",start:2051,end:2058,sentiment:"Fear",headline:"Governments clash with privacy networks and borderless money.",globalRange:[.45,1.65],coinModifiers:{XMR:[1.3,3.2],XRP:[.5,1.1],PEPE:[.25,1.6]}},
  {name:"Mars Expansion",start:2059,end:2068,sentiment:"Expansion",headline:"Off-world colonies adopt crypto settlement rails.",globalRange:[.55,2],coinModifiers:{BTC:[.9,2],DOGE:[.55,3],SOL:[.7,2.4]}},
  {name:"Quantum Panic",start:2069,end:2075,sentiment:"Extreme",headline:"Quantum breakthroughs cause violent repricing across all markets.",globalRange:[.25,2.4],coinModifiers:{BTC:[.3,1.9],XMR:[.7,3.5],PEPE:[.08,5.5]}}
];

const EVENTS = [
  {rarity:"COMMON",icon:"\u{1F30A}",title:"Calm Market",text:"Markets drift quietly with no clear direction.",mood:"Neutral",effects:{}},
  {rarity:"COMMON",icon:"\u{1F4C9}",title:"Liquidity Drain",text:"Capital exits risk assets across the timeline.",mood:"Risk Off",crash:true,effects:{BTC:[.65,.95],ETH:[.55,.9],SOL:[.38,.85],DOGE:[.25,.8],PEPE:[.08,.65],XRP:[.5,.9],XMR:[.7,1.05],LTC:[.65,.95]}},
  {rarity:"COMMON",icon:"\u{1F9CA}",title:"Crypto Winter",text:"Future traders rotate into cash and wait out the storm.",mood:"Bear Market",crash:true,effects:{BTC:[.5,.9],ETH:[.38,.85],SOL:[.25,.75],DOGE:[.18,.7],PEPE:[.04,.55],XRP:[.42,.85],XMR:[.65,1.05],LTC:[.58,.95]}},
  {rarity:"RARE",icon:"\u{1F3DB}\uFE0F",title:"Privacy Crackdown",text:"XMR demand surges after global restrictions.",mood:"Privacy Panic",effects:{XMR:[2.2,6.5],BTC:[.85,1.25],XRP:[.45,.95]}},
  {rarity:"RARE",icon:"\u26A1",title:"Solana Renaissance",text:"SOL becomes the settlement layer for gaming.",mood:"SOL Mania",effects:{SOL:[2.5,7.5],ETH:[.65,1.2],DOGE:[.55,1.6]}},
  {rarity:"RARE",icon:"\u{1F48E}",title:"Ethereum Supply Shock",text:"ETH supply drops after a massive burn cycle.",mood:"ETH Supply Shock",effects:{ETH:[2.2,6.2],BTC:[.85,1.35],SOL:[.55,1.25]}},
  {rarity:"RARE",icon:"\u2696\uFE0F",title:"XRP Settlement Era",text:"Regulatory clarity sends XRP sharply higher.",mood:"Regulatory Clarity",effects:{XRP:[2.3,7.2],XMR:[.45,.95],DOGE:[.55,1.35]}},
  {rarity:"EPIC",icon:"\u{1F7E0}",title:"Bitcoin Reserve Crisis",text:"Nation-states scramble for BTC reserves.",mood:"BTC Supply Shock",effects:{BTC:[2.2,6.8],LTC:[.85,1.7],ETH:[.8,1.6]}},
  {rarity:"EPIC",icon:"\u{1F438}",title:"Meme Coin Mania",text:"Degens flood DOGE and PEPE.",mood:"Meme Season",effects:{DOGE:[2.2,10],PEPE:[3.5,20],BTC:[.75,1.25],ETH:[.75,1.3]}},
  {rarity:"EPIC",icon:"\u{1F480}",title:"Exchange Collapse",text:"A major future exchange implodes and liquidity vanishes.",mood:"Fear",crash:true,effects:{BTC:[.45,.9],ETH:[.32,.82],SOL:[.2,.75],DOGE:[.12,.65],PEPE:[.03,.5],XRP:[.38,.82],LTC:[.45,.88]}},
  {rarity:"EPIC",icon:"\u{1F9E0}",title:"AI Trading Glitch",text:"Autonomous trading bots misprice the market.",mood:"Chaotic",ai:true,effects:{BTC:[.55,1.8],ETH:[.4,2.4],SOL:[.2,4.2],DOGE:[.1,6.5],PEPE:[.02,11],XRP:[.35,2.2],XMR:[.5,2],LTC:[.65,1.65]}},
  {rarity:"LEGENDARY",icon:"\u{1F680}",title:"Hyper Bull Market",text:"Risk assets explode across the timeline.",mood:"Euphoria",effects:{BTC:[1.5,3.5],ETH:[1.7,4.5],SOL:[2,7],DOGE:[2,10],PEPE:[3,20],XRP:[1.35,4],XMR:[.95,2.4],LTC:[1.25,3.2]}},
  {rarity:"LEGENDARY",icon:"\u{1F315}",title:"First Bitcoin Used on Mars",text:"BTC becomes the reserve asset of the first Mars economy.",mood:"Historic",effects:{BTC:[4,12],DOGE:[1.4,4],SOL:[1.2,3.4],ETH:[1.15,3]}},
  {rarity:"LEGENDARY",icon:"\u{1F300}",title:"Quantum Panic",text:"Quantum breakthroughs cause violent repricing across all markets.",mood:"Extreme",crash:true,effects:{BTC:[.18,2.8],ETH:[.22,4],SOL:[.08,6],DOGE:[.05,8],PEPE:[.03,12],XMR:[2,8],XRP:[.12,3.2],LTC:[.2,2.4]}},
  {rarity:"LEGENDARY",icon:"\u2604\uFE0F",title:"Total Market Meltdown",text:"Everything tanks as the entire future market enters panic.",mood:"Total Meltdown",crash:true,effects:{BTC:[.22,.55],ETH:[.15,.48],SOL:[.08,.38],DOGE:[.04,.32],PEPE:[.01,.25],XMR:[.25,.65],XRP:[.18,.55],LTC:[.24,.62]}},
  {rarity:"EPIC",icon:"\u{1F3E6}",title:"Global Banking Crisis",text:"Banks freeze withdrawals and crypto becomes the escape hatch.",mood:"Bank Panic",effects:{BTC:[1.6,4.2],XMR:[1.8,5.5],ETH:[.85,1.8],SOL:[.7,1.6],XRP:[.75,1.4],DOGE:[.65,1.4],PEPE:[.35,1.8],LTC:[1.1,2.4]}},
  {rarity:"EPIC",icon:"\u{1F4B5}",title:"Stablecoin Collapse",text:"A major stablecoin fails and traders scramble for safety.",mood:"Stablecoin Panic",crash:true,effects:{BTC:[.65,1.05],ETH:[.45,.85],SOL:[.3,.75],DOGE:[.18,.62],PEPE:[.04,.4],XMR:[.8,1.5],XRP:[.45,.9],LTC:[.62,1]}},
  {rarity:"RARE",icon:"\u{1F534}",title:"Mars Treasury Announcement",text:"Mars colonies announce BTC, DOGE, and SOL treasury reserves.",mood:"Mars Treasury",effects:{BTC:[1.8,5],DOGE:[1.6,6],SOL:[1.7,5.5],ETH:[.9,1.4],XMR:[.8,1.2]}},
  {rarity:"RARE",icon:"\u{1F9F1}",title:"Layer 2 Explosion",text:"Layer 2 adoption explodes across future finance.",mood:"Scaling Boom",effects:{ETH:[1.8,4.8],SOL:[1.4,3.8],BTC:[.95,1.5],XRP:[.8,1.4]}},
  {rarity:"COMMON",icon:"\u26FD",title:"Mining Energy Crisis",text:"Energy prices spike and proof-of-work miners struggle.",mood:"Energy Shock",crash:true,effects:{BTC:[.45,.85],LTC:[.42,.82],ETH:[.8,1.25],SOL:[.85,1.35],DOGE:[.5,.9]}},
  {rarity:"RARE",icon:"\u{1F6AB}",title:"Meme Ban Wave",text:"Major platforms ban meme coin promotion.",mood:"Meme Panic",crash:true,effects:{DOGE:[.12,.55],PEPE:[.03,.35],BTC:[.85,1.15],ETH:[.8,1.1]}},
  {rarity:"EPIC",icon:"\u{1F3AD}",title:"Meme Supercycle",text:"The internet loses its mind and meme coins go vertical.",mood:"Meme Supercycle",effects:{DOGE:[3,14],PEPE:[5,28],SOL:[1.1,2.8],ETH:[.9,1.6],BTC:[.9,1.4]}},
  {rarity:"RARE",icon:"\u{1F576}\uFE0F",title:"Privacy Coin Blackout",text:"Privacy coins vanish from exchanges and demand explodes.",mood:"Privacy Blackout",effects:{XMR:[2.8,9],BTC:[.8,1.4],XRP:[.35,.85],ETH:[.75,1.2]}},
  {rarity:"RARE",icon:"\u{1F4DC}",title:"Regulation Shockwave",text:"New global crypto rules reshape the market overnight.",mood:"Regulation Shock",effects:{XRP:[2,6.5],XMR:[.25,.75],BTC:[.75,1.25],ETH:[.7,1.2],SOL:[.6,1.15]}},
  {rarity:"EPIC",icon:"\u{1F916}",title:"AI Fund Liquidation",text:"A massive AI hedge fund unwinds billions in positions.",mood:"AI Liquidation",crash:true,ai:true,effects:{BTC:[.4,.9],ETH:[.28,.82],SOL:[.18,.75],DOGE:[.08,.65],PEPE:[.02,.5],XRP:[.3,.85],XMR:[.45,1.1],LTC:[.48,.9]}},
  {rarity:"RARE",icon:"\u{1F6E1}\uFE0F",title:"Quantum Security Upgrade",text:"Major chains deploy quantum-resistant upgrades.",mood:"Security Rally",effects:{BTC:[1.3,3.2],ETH:[1.25,3.5],XMR:[1.5,4.2],LTC:[1.1,2.2]}},
  {rarity:"RARE",icon:"\u{1F4C8}",title:"ETF Mania 2.0",text:"Future ETFs flood the market with institutional demand.",mood:"ETF Mania",effects:{BTC:[1.7,4.6],ETH:[1.5,4],LTC:[1.3,3],XRP:[1,1.8]}},
  {rarity:"RARE",icon:"\u{1F3AE}",title:"Gaming Chain Boom",text:"On-chain games onboard millions of new users.",mood:"Gaming Boom",effects:{SOL:[2,7],DOGE:[1.5,5],PEPE:[1.8,9],ETH:[1.1,2.4]}},
  {rarity:"LEGENDARY",icon:"\u{1F47D}",title:"Alien Signal Market Frenzy",text:"A mysterious alien signal triggers irrational market chaos.",mood:"Alien Frenzy",effects:{BTC:[.4,5],ETH:[.3,6],SOL:[.2,9],DOGE:[.1,12],PEPE:[.03,22],XMR:[.5,8],XRP:[.25,7],LTC:[.4,4]}}
];

const BASE_RARITY_WEIGHTS = { COMMON:54, RARE:29, EPIC:13, LEGENDARY:4 };

const ENCOUNTER_CHANCE = 0.22;
const CASH_FIND_CHANCE = 0.32;

const ENCOUNTERS = [
  {title:"Guaranteed 10x Staking",scenario:"A stranger offers you guaranteed 10x staking if you connect your wallet.",a:"Connect wallet",aOutcome:"scam",b:"Walk away",bOutcome:"safe"},
  {title:"Abandoned Hardware Wallet",scenario:"You find an abandoned hardware wallet blinking beside a lunar ATM.",a:"Try to unlock it",aOutcome:"opportunity",b:"Ignore it",bOutcome:"safe"},
  {title:"Future Influencer DM",scenario:"A famous future influencer sends you a private mint link.",a:"Open the link",aOutcome:"scam",b:"Block them",bOutcome:"cash"},
  {title:"Suspicious Airdrop",scenario:"A surprise airdrop appears in your wallet with a strange claim button.",a:"Claim it",aOutcome:"risky",b:"Skip it",bOutcome:"safe"},
  {title:"Broken Moon ATM",scenario:"A Moon Base ATM is accidentally dispensing extra credits.",a:"Use the glitch",aOutcome:"opportunity",b:"Report it",bOutcome:"cash"},
  {title:"Fake Bridge Website",scenario:"A bridge website promises instant low-fee transfers.",a:"Bridge tokens",aOutcome:"scam",b:"Verify contract",bOutcome:"safe"},
  {title:"AI Trading Bot",scenario:"An AI bot claims it can predict the next market jump.",a:"Pay for access",aOutcome:"scam",b:"Test sandbox mode",bOutcome:"cash"},
  {title:"Lost Miner Payout",scenario:"A miner payout was sent to an old forgotten address.",a:"Trace it",aOutcome:"opportunity",b:"Ignore it",bOutcome:"safe"},
  {title:"Pirate Liquidity Pool",scenario:"A pirate pool offers insane yield for one jump only.",a:"Deposit tokens",aOutcome:"risky",b:"Sail away",bOutcome:"safe"},
  {title:"Quantum Seed Recovery",scenario:"A quantum recovery tool says it can repair damaged seed phrases.",a:"Enter seed phrase",aOutcome:"scam",b:"Refuse",bOutcome:"safe"},
  {title:"Old Exchange Refund",scenario:"A bankrupt old exchange says you qualify for a refund.",a:"File claim",aOutcome:"opportunity",b:"Ignore email",bOutcome:"safe"},
  {title:"Celebrity Meme Launch",scenario:"A celebrity launches a new meme coin and says you are early.",a:"Ape in",aOutcome:"risky",b:"Pass",bOutcome:"safe"},
  {title:"Privacy Mixer Offer",scenario:"A shadowy mixer offers bonus XMR for testing its system.",a:"Use mixer",aOutcome:"risky",b:"Avoid it",bOutcome:"safe"},
  {title:"Mispriced NFT Vault",scenario:"A vault key appears mispriced by several zeroes.",a:"Buy key",aOutcome:"risky",b:"Skip",bOutcome:"safe"},
  {title:"Time Broker Side Deal",scenario:"The Time Broker offers a secret off-book deal.",a:"Accept deal",aOutcome:"risky",b:"Decline",bOutcome:"safe"}
];

const LEADERBOARD_KEY = "cryptoTimeTravelerLeaderboard";
let leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
let pendingScore = null;

let state = {};
let isJumping = false;
let townieInstances = [];
let activeTownieIndex = 0;
let activeTownieId = "townie1";

const $ = id => document.getElementById(id);

const UI = {
  titleScreen:$("titleScreen"), gameShell:$("gameShell"), missionBriefing:$("missionBriefing"), matrixRain:$("matrixRain"), townieSelectionArea:$("townieSelectionArea"), beginMissionBtn:$("beginMissionBtn"), prevTownieBtn:$("prevTownieBtn"), nextTownieBtn:$("nextTownieBtn"), startRunBtn:$("startRunBtn"),
  titleTowniePreview:$("titleTowniePreview"), titleRarity:$("titleRarity"), titleTownieName:$("titleTownieName"), titleTownieClass:$("titleTownieClass"), titleTownieBio:$("titleTownieBio"), titleTownieTraits:$("titleTownieTraits"),
  wallet:$("wallet"), loan:$("loan"), day:$("day"), location:$("location"), era:$("era"), sentiment:$("sentiment"), timeline:$("timeline"),
  marketList:$("marketList"), portfolioList:$("portfolioList"), eventLog:$("eventLog"), allocationBar:$("allocationBar"), allocationLegend:$("allocationLegend"),
  tradeBox:$("tradeBox"), tradeTitle:$("tradeTitle"), tradePrice:$("tradePrice"), tradeAmount:$("tradeAmount"), tradeTotal:$("tradeTotal"), tradeHelper:$("tradeHelper"), confirmTrade:$("confirmTradeBtn"), cancelTrade:$("cancelTradeBtn"),
  timeJump:$("timeJumpBtn"), takeLoan:$("takeLoanBtn"), payLoan:$("payLoanBtn"), newGame:$("newGameBtn"), brokerDescription:$("brokerDescription"),
  travelerName:$("travelerName"), travelerClass:$("travelerClass"), travelerPreview:$("travelerPreview"), stageTownie:$("stageTownie"), townieSelectList:$("townieSelectList"),
  jumpOverlay:$("jumpOverlay"), jumpTownie:$("jumpTownie"), jumpReveal:$("jumpReveal"), portalLeft:$("portalLeft"), portalRight:$("portalRight"),
  encounterOverlay:$("encounterOverlay"), encounterTitle:$("encounterTitle"), encounterScenario:$("encounterScenario"), encounterChoiceA:$("encounterChoiceA"), encounterChoiceB:$("encounterChoiceB"),
viewLeaderboardBtn:$("viewLeaderboardBtn"),
leaderboardScreen:$("leaderboardScreen"),
leaderboardHomeBtn:$("leaderboardHomeBtn"),
leaderboardList:$("leaderboardList"),
finalScoreBox:$("finalScoreBox"),
finalTowniePreview:$("finalTowniePreview"),
finalScoreValue:$("finalScoreValue"),
initialsInput:$("initialsInput"),
saveScoreBtn:$("saveScoreBtn")
};

function wait(ms){return new Promise(r=>setTimeout(r,ms));}
function rand(min,max){return min+Math.random()*(max-min);}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}
function randomFromRange(range){return rand(range[0],range[1]);}
function currentTownie(){return TOWNIES.find(t=>t.id===activeTownieId)||TOWNIES[0];}
function mod(){return currentTownie().mod||{};}

function money(value){
  if(value<.01&&value>0)return "$"+value.toFixed(8);
  return value.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:value>=100?2:8});
}

function units(value){
  if(!value)return "0";
  if(value<.0001)return value.toFixed(8);
  if(value<1)return value.toFixed(6);
  return value.toLocaleString("en-US",{maximumFractionDigits:4});
}

function formatDate(date){
  return date.toLocaleString("en-US",{month:"long",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"});
}

/* Townie animation */

async function loadJson(path){
  const response=await fetch(path);
  if(!response.ok)throw new Error(`Could not load ${path}`);
  return response.json();
}

function fallbackTownieMeta(){
  return {width:32,height:32,animations:{atk_right:{length:5,row:0},walk_right:{length:4,row:1},idle_right:{length:2,row:2},atk_up:{length:5,row:3},walk_up:{length:4,row:4},idle_up:{length:2,row:5},atk_down:{length:5,row:6},walk_down:{length:4,row:7},idle_down:{length:2,row:8}},offset_x:-8,offset_y:-12};
}

async function loadTownieAsset(townie){
  try{return {...townie,metaData:await loadJson(townie.meta)};}
  catch{return {...townie,metaData:fallbackTownieMeta()};}
}

function createTownieInstance(container,townieAsset,animationName="idle_down",scale=3,flip=false){
  container.innerHTML="";
  const frame=document.createElement("div");
  frame.className="townie-frame";
  container.appendChild(frame);

  const meta=townieAsset.metaData;
  let animation=meta.animations[animationName]||meta.animations.idle_down;
  let frameIndex=0,lastTime=0,rafId=null,active=true,currentAnimation=animationName,currentFlip=flip;

  frame.style.width=`${meta.width}px`;
  frame.style.height=`${meta.height}px`;
  frame.style.backgroundImage=`url("${townieAsset.sprite}")`;

  function applyTransform(){
    const sx=currentFlip?-scale:scale;
    frame.style.transform=`translate(-50%, -50%) scaleX(${sx}) scaleY(${scale})`;
  }

  function applyFrame(){
    frame.style.backgroundPosition=`${-(frameIndex*meta.width)}px ${-(animation.row*meta.height)}px`;
    applyTransform();
  }

  function loop(timestamp){
    if(!active)return;
    if(!lastTime)lastTime=timestamp;
    if(timestamp-lastTime>160){
      frameIndex=(frameIndex+1)%animation.length;
      applyFrame();
      lastTime=timestamp;
    }
    rafId=requestAnimationFrame(loop);
  }

  function setAnimation(nextAnimationName,nextFlip=currentFlip){
    if(!meta.animations[nextAnimationName])return;
    currentAnimation=nextAnimationName;
    currentFlip=nextFlip;
    animation=meta.animations[nextAnimationName];
    frameIndex=0;
    lastTime=0;
    applyFrame();
  }

  function destroy(){
    active=false;
    if(rafId)cancelAnimationFrame(rafId);
  }

  applyFrame();
  rafId=requestAnimationFrame(loop);
  const instance={setAnimation,destroy,frame,getAnimation:()=>currentAnimation};
  townieInstances.push(instance);
  return instance;
}

function clearTownieInstances(){
  townieInstances.forEach(i=>i.destroy());
  townieInstances=[];
}

async function refreshTownieDisplays(animationName="idle_down"){
  clearTownieInstances();
  const asset=await loadTownieAsset(currentTownie());

  UI.travelerName.textContent=asset.name;
  UI.travelerClass.textContent=`Class: ${asset.className}`;
  UI.brokerDescription.textContent=`Borrow ${money(CONFIG.loanPayout)}, owe ${money(CONFIG.loanPayback)}, interest may vary by traveler.`;

  createTownieInstance(UI.travelerPreview,asset,"idle_down",3,false);
  createTownieInstance(UI.stageTownie,asset,animationName,3,false);
  createTownieInstance(UI.jumpTownie,asset,"walk_right",3,false);

  renderTownieSelector();
}

async function renderTitleTownie(){
  if(!UI.titleTowniePreview) return;
  const townie=TOWNIES[activeTownieIndex];
  activeTownieId=townie.id;

  UI.titleTownieName.textContent=townie.name;
  UI.titleTownieClass.textContent=townie.className;
  UI.titleTownieBio.textContent=townie.bio;
  UI.titleRarity.textContent=townie.rarity;
  UI.titleRarity.className=`rarity-pill rarity-${townie.rarity.toLowerCase()}`;
  UI.titleTownieTraits.innerHTML=townie.traits.map(t=>`<li>${t}</li>`).join("");

  const asset=await loadTownieAsset(townie);
  createTownieInstance(UI.titleTowniePreview,asset,"idle_down",3,false);
}

async function selectTownie(townieId){
  if(state && state.unlockedTownieIds && !isTownieUnlocked(townieId)){
    log("That Townie is still locked. Keep growing your net worth to unlock more travelers.");
    return;
  }

  activeTownieId=townieId;
  activeTownieIndex=TOWNIES.findIndex(t=>t.id===townieId);
  if(activeTownieIndex<0)activeTownieIndex=0;

  await refreshTownieDisplays("idle_down");
  await renderTitleTownie();
}

function renderTownieSelector(){
  UI.townieSelectList.innerHTML="";

  TOWNIES.forEach(townie=>{
    const unlocked = isTownieUnlocked(townie.id);
    const selected = townie.id===activeTownieId;

    const card=document.createElement("div");
    card.className=`townie-select-card ${selected?"selected":""} ${unlocked?"":"locked"}`;

    const mini=document.createElement("div");
    mini.className="townie-canvas";

    const info=document.createElement("div");
    info.className="townie-select-info";
    info.innerHTML=`
      <h3>${townie.name}</h3>
      <p>${townie.rarity} \u2022 ${townie.className}</p>
      <p>${townie.traits[0]}</p>
      <p class="unlock-note">${getTownieUnlockLabel(townie.id)}</p>
    `;

    const button=document.createElement("button");

    if(selected){
      button.textContent="Selected";
      button.disabled=true;
    }else if(unlocked){
      button.textContent="Select";
      button.addEventListener("click",()=>selectTownie(townie.id));
    }else{
      button.textContent="Locked";
      button.disabled=true;
    }

    card.append(mini,info,button);
    UI.townieSelectList.appendChild(card);

    loadTownieAsset(townie).then(asset=>createTownieInstance(mini,asset,"idle_down",2.25,false));
  });
}

/* Game mechanics */

function getMaxLoans(){return mod().maxLoans||1;}
function getLoanInterest(){return CONFIG.loanInterestPerJump*(mod().interestMultiplier??1);}
function getStartingWallet(){return mod().startingWallet||CONFIG.startingWallet;}
function getMaxDays(){return CONFIG.maxDays+(mod().extraDays||0)-(mod().dayPenalty||0);}

function getUnlockedTownieIds(){
  return state.unlockedTownieIds || [activeTownieId];
}

function isTownieUnlocked(townieId){
  return getUnlockedTownieIds().includes(townieId);
}

function getNextUnlockMilestone(){
  const unlockedExtraCount = Math.max(getUnlockedTownieIds().length - 1, 0);
  return TOWNIE_UNLOCK_MILESTONES[unlockedExtraCount] || null;
}

function unlockRandomTownie(){
  const lockedTownies = TOWNIES.filter(function(townie){
    return !isTownieUnlocked(townie.id);
  });

  if(!lockedTownies.length) return null;

  const unlocked = pick(lockedTownies);
  state.unlockedTownieIds.push(unlocked.id);

  return unlocked;
}

function checkTownieUnlocks(){
  let nextMilestone = getNextUnlockMilestone();
  let unlockedAny = false;

  while(nextMilestone && netWorth() >= nextMilestone){
    const unlocked = unlockRandomTownie();

    if(!unlocked) break;

    unlockedAny = true;

    log(
      "\u{1F511} New Townie unlocked at " +
      money(nextMilestone) +
      " net worth: " +
      unlocked.name +
      " \u2014 " +
      unlocked.className +
      "!"
    );

    nextMilestone = getNextUnlockMilestone();
  }

  if(unlockedAny){
    renderTownieSelector();
  }
}

function getTownieUnlockLabel(townieId){
  if(isTownieUnlocked(townieId)) return "Unlocked";

  const unlockedCount = getUnlockedTownieIds().length;
  const milestone = TOWNIE_UNLOCK_MILESTONES[unlockedCount - 1];

  if(milestone){
    return "Unlocks after " + money(milestone) + " net worth";
  }

  return "Locked";
}															  
															  
function getRarityWeights(){
  const weights={...BASE_RARITY_WEIGHTS};
  if(mod().rarityBoost){
    weights.RARE+=Math.round(weights.RARE*mod().rarityBoost);
    weights.EPIC+=Math.round(weights.EPIC*mod().rarityBoost);
    weights.LEGENDARY+=Math.round(weights.LEGENDARY*mod().rarityBoost);
  }
  if(mod().legendaryBoost)weights.LEGENDARY+=Math.round(100*mod().legendaryBoost);
  return weights;
}

function pickRarity(){
  const weights=getRarityWeights();
  const total=Object.values(weights).reduce((s,w)=>s+w,0);
  let roll=rand(0,total);
  for(const [rarity,weight] of Object.entries(weights)){
    if(roll<weight)return rarity;
    roll-=weight;
  }
  return "COMMON";
}

function randomEvent(){
  let rarity=pickRarity();
  let pool=EVENTS.filter(e=>e.rarity===rarity);

  if(mod().avoidCrash&&Math.random()<mod().avoidCrash){
    pool=pool.filter(e=>!e.crash);
    if(!pool.length)pool=EVENTS.filter(e=>e.rarity===rarity&&!e.crash);
  }

  return pick(pool.length?pool:EVENTS);
}

function softClampPrice(value,symbol){
  const coin=COINS[symbol], cap=state.dynamicCaps[symbol];
  if(value<coin.min)return coin.min*rand(1,1.06);
  if(value>cap)return cap*rand(.92,1.035);
  return value;
}

async function fetchCurrentPrices(){
  const ids=Object.values(COINS).map(c=>c.coinGeckoId).join(",");
  const response=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
  if(!response.ok)throw new Error("Unable to fetch current prices.");
  const data=await response.json();

  Object.keys(COINS).forEach(symbol=>{
    const coin=COINS[symbol];
    state.prices[symbol]=data[coin.coinGeckoId]?.usd||rand(coin.min,coin.max*.08);
    state.previousPrices[symbol]=state.prices[symbol];
  });
}

async function resetGame(){
  isJumping=false;

  state={
    wallet:getStartingWallet()+(mod().startingBonus||0),
    loan:0,
    loansTaken:0,
    day:1+(mod().dayPenalty||0),
    maxDays:getMaxDays(),
    location:"Present Day",
    timeline:new Date(),
    currentEra:{name:"Present Day",sentiment:"Live Market",headline:"Current crypto prices loaded from the present timeline."},
    marketMood:"Live Market",
    prices:{},
    previousPrices:{},
    dynamicCaps:{},
    portfolio:{},
    activeTrade:null,
    gameOver:false,
    stimulusUsed:false,
	unlockedTownieIds:[activeTownieId]
  };

  Object.keys(COINS).forEach(symbol=>{
    state.portfolio[symbol]=0;
    state.dynamicCaps[symbol]=COINS[symbol].max*rand(.94,1.12);
  });

  UI.eventLog.innerHTML="";
  log(`Starting traveler: ${currentTownie().name} \u2014 ${currentTownie().className}.`);
  log("Welcome, traveler. Your run begins in the present day.");
  log("Loading current crypto prices...");
  render();

  try{
    await fetchCurrentPrices();
    log("Current market prices loaded.");
  }catch{
    log("Live prices unavailable. Using simulated starting prices.");
    Object.keys(COINS).forEach(symbol=>{
      state.prices[symbol]=rand(COINS[symbol].min,COINS[symbol].max*.08);
      state.previousPrices[symbol]=state.prices[symbol];
    });
  }

  await refreshTownieDisplays("idle_down");
  render();
}

function getEraForDate(date){
  const year=date.getFullYear();
  return TIMELINE_ERAS.find(e=>year>=e.start&&year<=e.end)||TIMELINE_ERAS[0];
}

function randomFutureDate(){
  return new Date(rand(CONFIG.futureStartDate.getTime(),new Date(`${CONFIG.endYear}-12-31T23:59:59`).getTime()));
}

function randomLocation(){
  let next=state.location;
  while(next===state.location||next==="Present Day")next=pick(LOCATIONS);
  return next;
}

function applyTownieMoveModifiers(symbol,move,event){
  const m=mod();

  if(m.coinBoost?.[symbol]&&move>1)move*=m.coinBoost[symbol];
  if(m.coinShield?.[symbol]&&move<1)move=1-((1-move)*(1-m.coinShield[symbol]));
  if(m.coinVolatility?.[symbol]){
    const vol=m.coinVolatility[symbol];
    move=move>1?1+((move-1)*vol):1-((1-move)*vol);
  }
  if(m.memeDampener&&(symbol==="DOGE"||symbol==="PEPE")&&move>1)move=1+((move-1)*m.memeDampener);
  if(m.eraCoinBoost&&state.currentEra.name===m.eraCoinBoost.era&&m.eraCoinBoost.coins[symbol]&&move>1)move*=m.eraCoinBoost.coins[symbol];
  if(m.aiBoost&&event.ai&&move>1)move*=m.aiBoost;
  if(m.strangeBoost&&event.title.includes("Quantum")&&move>1)move*=m.strangeBoost;
  if(m.crashShield&&event.crash&&move<1)move=1-((1-move)*(1-m.crashShield));
  if(m.luckyCrashSave&&event.crash&&move<.6&&Math.random()<m.luckyCrashSave)move=rand(.72,.92);

  return move;
}

function updateMarket(event){
  const era=state.currentEra;
  const globalEraMove=randomFromRange(era.globalRange);
  const before=netWorth();

  Object.keys(COINS).forEach(symbol=>{
    const coin=COINS[symbol];
    const oldPrice=state.prices[symbol]||rand(coin.min,coin.max*.08);

    let eventMove=1;
    if(event.effects?.[symbol])eventMove=randomFromRange(event.effects[symbol]);
    else if(event.effects&&Object.keys(event.effects).length>0)eventMove=rand(.78,1.22);
    else eventMove=rand(1-coin.volatility*.85,1+coin.volatility*.85);

    const eraCoinRange=era.coinModifiers[symbol];
    const eraCoinMove=eraCoinRange?randomFromRange(eraCoinRange):rand(.86,1.16);

    const gambleDirection=Math.random()<.5?-1:1;
    const chaosBonus=mod().chaosBonus||0;
    const gambleStrength=rand(0,coin.volatility*(1.25+chaosBonus));
    const gambleMove=1+gambleDirection*gambleStrength;

    let chaosMove=1;
    if(Math.random()<.08+chaosBonus)chaosMove=rand(1.8,6.5);
    if(Math.random()<.08+chaosBonus)chaosMove=rand(.12,.55);

    let combinedMove=globalEraMove*eraCoinMove*eventMove*gambleMove*rand(.92,coin.bias+.08)*chaosMove;
    combinedMove=applyTownieMoveModifiers(symbol,combinedMove,event);

    if(mod().jester&&Math.random()<mod().jester)combinedMove*=Math.random()<.5?rand(.35,.75):rand(1.5,3.5);

    state.previousPrices[symbol]=oldPrice;
    state.prices[symbol]=softClampPrice(oldPrice*combinedMove,symbol);
  });

  const after=netWorth();

  if(mod().crashStimulus&&!state.stimulusUsed&&after<before*.65){
    state.wallet+=mod().crashStimulus;
    state.stimulusUsed=true;
    log(`Stimulus activated: ${money(mod().crashStimulus)} emergency crash relief received.`);
  }

  if(mod().lootChance&&Math.random()<mod().lootChance){
    const symbol=pick(Object.keys(COINS));
    const lootValue=rand(50,350);
    const amount=lootValue/state.prices[symbol];
    state.portfolio[symbol]+=amount;
    log(`Loot Runner found ${units(amount)} ${symbol}.`);
  }

  if(mod().diversificationBonus){
    const held=Object.keys(state.portfolio).filter(s=>state.portfolio[s]>0).length;
    if(held>=4){
      const bonus=state.wallet*mod().diversificationBonus;
      state.wallet+=bonus;
      log(`Empire Builder diversification bonus: ${money(bonus)}.`);
    }
  }
}

function getMarketReactionSummary(){
  return Object.keys(COINS).map(symbol=>{
    const price=state.prices[symbol]||0, previous=state.previousPrices[symbol]||price;
    const percent=previous>0?((price-previous)/previous)*100:0;
    const arrow=percent>=0?"\u25B2":"\u25BC";
    return `${symbol} ${arrow} ${percent.toFixed(1)}%`;
  }).join(" | ");
}

function buildRevealHTML(event){
  return `<h2>\u23F3 TIME JUMP COMPLETE</h2>
    <p><strong>Location:</strong> ${state.location}</p>
    <p><strong>Date:</strong> ${formatDate(state.timeline)}</p>
    <p><strong>Timeline:</strong> ${state.currentEra.name}</p>
    <p><strong>${event.icon} ${event.rarity} EVENT:</strong> ${event.title}</p>
    <p>${event.text}</p>
    <p><strong>Market Reaction:</strong> ${getMarketReactionSummary()}</p>`;
}

function logTimeJumpReveal(event){
  log("================================");
  log("\u23F3 TIME JUMP COMPLETE");
  log(`Location: ${state.location}`);
  log(`Date: ${formatDate(state.timeline)}`);
  log(`Timeline: ${state.currentEra.name}`);
  log(`${event.icon} ${event.rarity} EVENT: ${event.title}`);
  log(event.text);
  log(`Market Reaction: ${getMarketReactionSummary()}`);
  log("================================");
}

async function playTimeJumpAnimation(event){
  await refreshTownieDisplays("walk_right");

  UI.jumpOverlay.classList.remove("hidden","arrive");
  UI.jumpReveal.classList.add("hidden");
  UI.portalLeft.classList.remove("hidden");
  UI.portalRight.classList.add("hidden");

  await wait(1200);

  const asset=await loadTownieAsset(currentTownie());
  createTownieInstance(UI.jumpTownie,asset,"walk_right",3,true);

  UI.jumpOverlay.classList.add("arrive");
  UI.portalLeft.classList.add("hidden");
  UI.portalRight.classList.remove("hidden");

  await wait(900);

  UI.jumpReveal.innerHTML=buildRevealHTML(event);
  UI.jumpReveal.classList.remove("hidden");

  await wait(1500);

  UI.jumpOverlay.classList.add("hidden");
  UI.jumpOverlay.classList.remove("arrive");

  await refreshTownieDisplays("idle_down");
}

function ownedCryptoSymbols(){
  return Object.keys(state.portfolio).filter(symbol=>state.portfolio[symbol]>0);
}

function awardRandomCashFind(){
  if(Math.random()>CASH_FIND_CHANCE)return;

  const amount=Math.round(rand(25,450));
  state.wallet+=amount;
  log(`You found ${money(amount)} in forgotten future cash.`);
}

function rewardRandomCrypto(reason="Opportunity reward"){
  const symbol=pick(Object.keys(COINS));
  const value=rand(75,700);
  const amount=value/(state.prices[symbol]||1);

  state.portfolio[symbol]+=amount;
  log(`${reason}: received ${units(amount)} ${symbol}, worth about ${money(value)}.`);
}

function loseRandomCrypto(reason="Scam loss"){
  const owned=ownedCryptoSymbols();

  if(!owned.length){
    const loss=Math.min(state.wallet,Math.round(rand(50,300)));
    state.wallet-=loss;
    log(`${reason}: no crypto was available, but you lost ${money(loss)} cash.`);
    return;
  }

  const symbol=pick(owned);
  const percent=rand(.08,.32);
  const amount=state.portfolio[symbol]*percent;
  const value=amount*(state.prices[symbol]||0);

  state.portfolio[symbol]-=amount;
  log(`${reason}: lost ${units(amount)} ${symbol}, worth about ${money(value)}.`);
}

function resolveEncounterOutcome(outcome){
  if(outcome==="safe"){
    log("Encounter avoided. Nothing happened.");
    return;
  }

  if(outcome==="cash"){
    const amount=Math.round(rand(50,250));
    state.wallet+=amount;
    log(`Careful choice rewarded: found ${money(amount)}.`);
    return;
  }

  if(outcome==="opportunity"){
    rewardRandomCrypto("Opportunity found");
    return;
  }

  if(outcome==="scam"){
    loseRandomCrypto("Scam triggered");
    return;
  }

  if(outcome==="risky"){
    if(Math.random()<.45){
      rewardRandomCrypto("Risk paid off");
    }else{
      loseRandomCrypto("Risk failed");
    }
  }
}

function showEncounterPrompt(encounter){
  return new Promise(resolve=>{
    UI.encounterTitle.textContent=encounter.title;
    UI.encounterScenario.textContent=encounter.scenario;
    UI.encounterChoiceA.textContent=encounter.a;
    UI.encounterChoiceB.textContent=encounter.b;

    UI.encounterOverlay.classList.remove("hidden");

    UI.encounterChoiceA.onclick=()=>{
      UI.encounterOverlay.classList.add("hidden");
      resolveEncounterOutcome(encounter.aOutcome);
      resolve();
    };

    UI.encounterChoiceB.onclick=()=>{
      UI.encounterOverlay.classList.add("hidden");
      resolveEncounterOutcome(encounter.bOutcome);
      resolve();
    };
  });
}

async function maybeTriggerEncounter(){
  if(Math.random()>ENCOUNTER_CHANCE)return;

  const encounter=pick(ENCOUNTERS);
  log(`Timeline encounter discovered: ${encounter.title}.`);
  await showEncounterPrompt(encounter);
}

async function timeJump(){
  if(state.gameOver||isJumping)return;
  if(state.day>=state.maxDays)return endGame();

  isJumping=true;
  document.querySelector(".game-shell").classList.add("time-jump-active");
  setTimeout(()=>document.querySelector(".game-shell").classList.remove("time-jump-active"),900);

  state.day+=1;
  state.location=randomLocation();
  state.timeline=randomFutureDate();
  state.currentEra=getEraForDate(state.timeline);

  if(state.loan>0){
    const interest=getLoanInterest()*state.loansTaken;
    state.loan+=interest;
    log(`Time Broker interest added: ${money(interest)}.`);
  }

  const event=randomEvent();
  state.marketMood=event.mood||state.currentEra.sentiment;

  updateMarket(event);
  render();

  await playTimeJumpAnimation(event);

  logTimeJumpReveal(event);

  awardRandomCashFind();
  await maybeTriggerEncounter();
  checkTownieUnlocks();

  closeTrade();
  render();

  if(state.day>=state.maxDays)endGame();
  isJumping=false;
}

function openTrade(type,symbol){
  state.activeTrade={type,symbol};
  const owned=state.portfolio[symbol], price=state.prices[symbol]||0;

  UI.tradeBox.classList.remove("hidden");
  UI.tradeAmount.value="";
  UI.tradeTotal.textContent=money(0);
  UI.tradeTitle.textContent=`${type==="buy"?"Buy":"Sell"} ${symbol}`;
  UI.tradePrice.textContent=money(price);
  UI.confirmTrade.textContent=type==="buy"?"Confirm Buy":"Confirm Sell";
  UI.tradeHelper.textContent=type==="buy"?`Available Fiat Money: ${money(state.wallet)}`:`You own ${units(owned)} ${symbol}, worth ${money(owned*price)}.`;
  UI.tradeAmount.focus();
}

function closeTrade(){
  state.activeTrade=null;
  UI.tradeBox.classList.add("hidden");
  UI.tradeAmount.value="";
  UI.tradeTotal.textContent=money(0);
}

function updateTradeTotal(){
  if(!state.activeTrade)return;
  const tradeAmount=Number(UI.tradeAmount.value), price=state.prices[state.activeTrade.symbol]||0;
  UI.tradeTotal.textContent=tradeAmount>0?money(tradeAmount*price):money(0);
}

function setTradePercent(percent){
  if(!state.activeTrade)return;
  const {type,symbol}=state.activeTrade, price=state.prices[symbol]||0;
  if(price<=0)return;
  UI.tradeAmount.value=type==="buy"?(state.wallet*percent)/price:state.portfolio[symbol]*percent;
  updateTradeTotal();
}

function confirmTrade(){
  if(!state.activeTrade||state.gameOver)return;

  const {type,symbol}=state.activeTrade;
  const tradeAmount=Number(UI.tradeAmount.value), price=state.prices[symbol]||0, total=tradeAmount*price;

  if(!tradeAmount||tradeAmount<=0)return log("Enter a valid amount first.");

  if(type==="buy"){
    if(state.wallet<total)return log(`Not enough Fiat Money to buy ${symbol}.`);
    state.wallet-=total;
    state.portfolio[symbol]+=tradeAmount;
    log(`Bought ${units(tradeAmount)} ${symbol} for ${money(total)}.`);
  }

  if(type==="sell"){
    if(state.portfolio[symbol]<tradeAmount)return log(`You do not own enough ${symbol}.`);
    state.portfolio[symbol]-=tradeAmount;
    state.wallet+=total;
    log(`Sold ${units(tradeAmount)} ${symbol} for ${money(total)}.`);
  }

  closeTrade();
  checkTownieUnlocks();
  render();
}

function takeLoan(){
  if(state.gameOver)return;
  if(state.loansTaken>=getMaxLoans())return log(`Loan limit reached. ${currentTownie().className} can hold ${getMaxLoans()} loan(s).`);

  state.wallet+=CONFIG.loanPayout;
  state.loan+=CONFIG.loanPayback;
  state.loansTaken+=1;

  log(`Borrowed ${money(CONFIG.loanPayout)}. Total loan balance is ${money(state.loan)}.`);
  checkTownieUnlocks();
  render();
}

function payLoan(){
  if(state.gameOver)return;
  if(state.loan<=0)return log("You do not have an active loan.");
  if(state.wallet<state.loan)return log(`You need ${money(state.loan)} to pay the full loan.`);

  const paid=state.loan;
  state.wallet-=paid;
  state.loan=0;
  state.loansTaken=0;

  log(`Paid off the full Time Broker loan: ${money(paid)}.`);
  checkTownieUnlocks();
  render();
}

function portfolioValue(){
  return Object.keys(COINS).reduce((total,symbol)=>total+state.portfolio[symbol]*(state.prices[symbol]||0),0);
}

function netWorth(){
  return state.wallet+portfolioValue()-state.loan;
}

function getLeaderboard(){
  return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
}

function setLeaderboard(entries){
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function showLeaderboardScreen(fromEndRun=false){
  UI.titleScreen.classList.add("hidden");
  UI.gameShell.classList.add("hidden");
  UI.leaderboardScreen.classList.remove("hidden");

  UI.finalScoreBox.classList.toggle("hidden", !fromEndRun);
  UI.finalScoreBox.classList.remove("score-saving");

  const oldBanner = document.querySelector(".victory-banner");
  if(oldBanner) oldBanner.remove();

  if(fromEndRun && pendingScore){
    UI.finalScoreValue.textContent = money(0);
    UI.initialsInput.value = "";

    startScoreCountUp(pendingScore.score);

    loadTownieAsset(currentTownie()).then(asset=>{
      createTownieInstance(UI.finalTowniePreview, asset, "idle_down", 2.25, false);
    });

    setTimeout(()=>celebrateScore(99), 300);
  }

  renderLeaderboard();
}

function startScoreCountUp(finalScore){
  const duration = 1200;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(finalScore * eased);

    UI.finalScoreValue.textContent = money(current);

    if(progress < 1){
      requestAnimationFrame(tick);
    }else{
      UI.finalScoreValue.textContent = money(finalScore);
    }
  }

  requestAnimationFrame(tick);
}

function savePendingScore(){
  if(!pendingScore) return;

  const initials = (UI.initialsInput.value || "AAA").toUpperCase().slice(0, 3);
  const entryId = `score-${Date.now()}`;

  const newEntry = {
    id: entryId,
    initials,
    score: pendingScore.score,
    travelerId: pendingScore.travelerId,
    traveler: pendingScore.traveler,
    className: pendingScore.className,
    date: new Date().toLocaleDateString()
  };

  const oldLeaderboard = getLeaderboard();
  const combined = [...oldLeaderboard, newEntry].sort((a,b)=>b.score-a.score);
  const finalRank = combined.findIndex(entry=>entry.id===entryId);

  UI.finalScoreBox.classList.add("score-saving");

  const temporaryList = oldLeaderboard.slice(0, 10);
  temporaryList.push(newEntry);

  renderLeaderboard({
    entries: temporaryList,
    highlightId: entryId,
    pendingBottom: true
  });

  animateScoreClimb(oldLeaderboard, newEntry, combined, finalRank);
}

function animateScoreClimb(oldLeaderboard, newEntry, combined, finalRank){
  let climbList = oldLeaderboard.slice(0, 10);
  climbList.push(newEntry);

  let currentIndex = climbList.length - 1;

  function step(){
    renderLeaderboard({
      entries: climbList,
      highlightId: newEntry.id,
      climbingIndex: currentIndex
    });

    if(currentIndex <= finalRank){
      const topTen = combined.slice(0, 10);
      setLeaderboard(topTen);

      UI.finalScoreBox.classList.add("hidden");
      UI.finalScoreBox.classList.remove("score-saving");
      pendingScore = null;

      renderLeaderboard({
        entries: topTen,
        highlightId: newEntry.id,
        finalRank
      });

      celebrateScore(finalRank);
      showVictoryBanner(finalRank);
      return;
    }

    const nextIndex = currentIndex - 1;

let delay = 420;

if(nextIndex <= 2) delay = 700;
if(nextIndex === 1) delay = 900;
if(nextIndex === 0) delay = 1150;

setTimeout(()=>{
  const temp = climbList[currentIndex - 1];
  climbList[currentIndex - 1] = climbList[currentIndex];
  climbList[currentIndex] = temp;
  currentIndex--;
  step();
}, delay);
  }

  step();
}

function showVictoryBanner(finalRank){
  const oldBanner = document.querySelector(".victory-banner");
  if(oldBanner) oldBanner.remove();

  const banner = document.createElement("div");
  banner.className = "victory-banner";

  if(finalRank === 0){
    banner.textContent = "\u{1F3C6} NEW LOCAL LEGEND!";
  }else if(finalRank === 1){
    banner.textContent = "\u{1F948} NEW #2 SCORE!";
  }else if(finalRank === 2){
    banner.textContent = "\u{1F949} TOP 3 FINISH!";
  }else if(finalRank >= 0 && finalRank < 10){
    banner.textContent = `\u2B50 TOP 10 SCORE! RANK #${finalRank + 1}`;
  }else{
    banner.textContent = "RUN SAVED!";
  }

  UI.leaderboardList.before(banner);
}

function renderLeaderboard(options={}){
  const leaderboard = options.entries || getLeaderboard();
  const highlightId = options.highlightId || null;

  if(!leaderboard.length){
    UI.leaderboardList.innerHTML = `<p class="empty-leaderboard">No scores yet. Start a run!</p>`;
    return;
  }

  UI.leaderboardList.innerHTML = "";

  leaderboard.forEach((entry,index)=>{
    const row = document.createElement("div");

const isNewScore = entry.id && entry.id === highlightId;
row.className = `leaderboard-entry ${isNewScore ? "new-score-row" : ""}`;

if(options.climbingIndex !== undefined && index === options.climbingIndex + 1){
  row.classList.add("score-bumped");
}

    const townie = TOWNIES.find(t=>t.id===entry.travelerId) || TOWNIES[0];

    const rankDisplay = getRankDisplay(index);

    row.innerHTML = `
      <div class="rank ${index < 3 ? "leaderboard-rank-medal" : ""}">${rankDisplay}</div>
      <div class="leaderboard-initials">${entry.initials}</div>
      <div class="leaderboard-score">${money(entry.score)}</div>
      <div class="townie-canvas mini-townie" title="${entry.className}"></div>
    `;

    UI.leaderboardList.appendChild(row);

    const mini = row.querySelector(".mini-townie");

    loadTownieAsset(townie).then(asset=>{
      createTownieInstance(mini, asset, "idle_down", 1.7, false);
    });
  });
}

function getRankDisplay(index){
  if(index === 0) return "#1\u{1F947}";
  if(index === 1) return "#2\u{1F948}";
  if(index === 2) return "#3\u{1F949}";
  return `#${index + 1}`;
}

function celebrateScore(finalRank){
  const intensity = finalRank === 0 ? 34 : finalRank < 3 ? 24 : 14;

  for(let i=0; i<intensity; i++){
    setTimeout(()=>launchCoinBurst(), i * 45);
  }

  if(finalRank < 3){
    for(let i=0; i<8; i++){
      setTimeout(()=>launchFirework(), i * 120);
    }
  }
}

function launchCoinBurst(){
  const particle = document.createElement("div");
  particle.className = "celebration-particle";
  particle.textContent = Math.random() > 0.5 ? "\u{1F7E0}" : "\u20BF";

  particle.style.left = `${rand(20, 80)}vw`;
  particle.style.top = `${rand(35, 78)}vh`;
  particle.style.setProperty("--x", `${rand(-140, 140)}px`);
  particle.style.setProperty("--y", `${rand(-220, -80)}px`);

  document.body.appendChild(particle);

  setTimeout(()=>particle.remove(), 1400);
}

function launchFirework(){
  const centerX = rand(20, 80);
  const centerY = rand(18, 42);

  for(let i=0; i<14; i++){
    const dot = document.createElement("div");
    dot.className = "firework-dot";

    const angle = (Math.PI * 2 * i) / 14;
    const distance = rand(35, 95);

    dot.style.left = `${centerX}vw`;
    dot.style.top = `${centerY}vh`;
    dot.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    dot.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    document.body.appendChild(dot);

    setTimeout(()=>dot.remove(), 900);
  }
}

function endGame(){
  if(mod().debtForgiveness&&state.loan>0&&netWorth()>50000){
    const forgiven=Math.min(CONFIG.loanPayback,state.loan);
    state.loan-=forgiven;
    log(`Time Broker end-run forgiveness: ${money(forgiven)} debt erased.`);
  }

  state.gameOver=true;
log("Run complete.");
log(`Final net worth: ${money(netWorth())}.`);

const scoreTownie = TOWNIES.find(t=>t.id===state.unlockedTownieIds[0]) || currentTownie();

pendingScore = {
  score: Math.round(netWorth()),
  travelerId: scoreTownie.id,
  traveler: scoreTownie.name,
  className: scoreTownie.className
};

showLeaderboardScreen(true);
}

function log(message){
  const p=document.createElement("p");
  p.textContent="\u25BA "+message;
  UI.eventLog.prepend(p);
  while(UI.eventLog.children.length>CONFIG.maxLogEntries)UI.eventLog.removeChild(UI.eventLog.lastChild);
}

function render(){
  renderStatus();
  renderMarket();
  renderPortfolio();
  renderAllocation();
}

function renderStatus(){
  UI.wallet.textContent=money(state.wallet);
  UI.loan.textContent=money(state.loan);
  UI.day.textContent=`${state.day} / ${state.maxDays}`;
  UI.location.textContent=state.location;
  UI.timeline.textContent=formatDate(state.timeline);
  UI.era.textContent=state.currentEra.name;
  UI.sentiment.textContent=state.marketMood;
}

function renderMarket(){
  UI.marketList.innerHTML="";
  Object.keys(COINS).forEach(symbol=>{
    const coin=COINS[symbol], price=state.prices[symbol]||0, previous=state.previousPrices[symbol]||price;
    const isUp=price>=previous, direction=isUp?"\u25B2":"\u25BC", priceClass=isUp?"price-up":"price-down";
    const percent=previous>0?((price-previous)/previous)*100:0;

    const card=document.createElement("div");
    card.className="coin-card";
    card.innerHTML=`<div class="coin-top"><div class="coin-name-block"><span class="coin-icon coin-icon-${symbol}"><img src="${coin.icon}" alt="${coin.name} logo" /></span><div class="coin-symbol">${symbol}<small>${coin.name}</small></div></div></div><div class="coin-price ${priceClass}">${money(price)} ${direction} ${percent.toFixed(1)}%</div><div class="coin-buttons"><button class="buy-btn" data-action="buy" data-symbol="${symbol}">Buy</button><button class="sell-btn" data-action="sell" data-symbol="${symbol}">Sell</button></div>`;
    UI.marketList.appendChild(card);
  });
}

function renderPortfolio(){
  UI.portfolioList.innerHTML="";
  Object.keys(COINS).forEach(symbol=>{
    const coin=COINS[symbol], owned=state.portfolio[symbol], value=owned*(state.prices[symbol]||0);

    const row=document.createElement("div");
    row.className="portfolio-row";
    row.innerHTML=`<div class="coin-name-block"><span class="coin-icon coin-icon-${symbol}"><img src="${coin.icon}" alt="${coin.name} logo" /></span><div class="coin-symbol">${symbol}<small>${units(owned)} owned</small></div></div><div class="portfolio-actions"><strong>${money(value)}</strong><button class="sell-btn" data-symbol="${symbol}">Sell</button></div>`;
    UI.portfolioList.appendChild(row);
  });
}

function renderAllocation(){
  const pieces=[], total=Math.max(state.wallet+portfolioValue(),1);
  pieces.push({label:"Fiat Money",value:state.wallet,color:"#14532d"});

  Object.keys(COINS).forEach(symbol=>{
    const value=state.portfolio[symbol]*(state.prices[symbol]||0);
    if(value>0)pieces.push({label:symbol,value,color:colorFor(symbol)});
  });

  UI.allocationBar.innerHTML="";
  UI.allocationLegend.innerHTML="";

  pieces.forEach(piece=>{
    const percent=(piece.value/total)*100;

    const segment=document.createElement("div");
    segment.className="allocation-segment";
    segment.style.width=`${percent}%`;
    segment.style.background=piece.color;
    UI.allocationBar.appendChild(segment);

    const row=document.createElement("div");
    row.className="legend-row";
    row.innerHTML=`<div class="legend-left"><span class="legend-dot" style="background:${piece.color}"></span><span>${piece.label}</span></div><span>${percent.toFixed(1)}%</span>`;
    UI.allocationLegend.appendChild(row);
  });
}

function colorFor(symbol){
  return {BTC:"#f7931a",LTC:"#94a3b8",ETH:"#8b5cf6",SOL:"#7c3aed",DOGE:"#c2a633",XMR:"#ff6600",XRP:"#374151",PEPE:"#22c55e"}[symbol]||"#ffffff";
}

function buildMatrixRain(){
  if(!UI.matrixRain) return;

  UI.matrixRain.innerHTML = "";

  const chars = "010101BTCETHSOLXRPDOGEPEPEAFIJKMNQUVWYZ10101010";
  const columns = 34;

  for(let i = 0; i < columns; i++){
    const column = document.createElement("div");
    column.className = "matrix-column";

    let text = "";

    for(let j = 0; j < 28; j++){
      text += chars[Math.floor(Math.random() * chars.length)] + "<br>";
    }

    column.innerHTML = text;
    column.style.left = (i / columns) * 100 + "%";
    column.style.animationDuration = rand(5, 12) + "s";
    column.style.animationDelay = rand(0, 5) + "s";

    UI.matrixRain.appendChild(column);
  }
}

async function typeMissionBriefing(){
  const lines = document.querySelectorAll(".briefing-line");
  const actions = document.querySelector(".mission-actions");

  if(actions){
    actions.classList.remove("ready");
  }

  lines.forEach(line=>{
    line.dataset.fullText = line.textContent.trim();
    line.textContent = "";
    line.classList.remove("typing","done");
  });

  await wait(500);

  for(const line of lines){
    const text = line.dataset.fullText;

    line.classList.add("typing");

    await wait(450);

    for(let i = 0; i <= text.length; i++){
      line.textContent = text.slice(0, i);
      await wait(22);
    }

    line.classList.remove("typing");
    line.classList.add("done");

    await wait(350);
  }

// Give the player a moment to read the final line.
await wait(700);
	
  if(actions){
    actions.classList.add("ready");
  }
}

document.querySelectorAll(".tab-btn").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(btn=>btn.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(panel=>panel.classList.remove("active"));
    button.classList.add("active");
    $(button.dataset.tab).classList.add("active");
  });
});

UI.beginMissionBtn.addEventListener("click",async()=>{
  UI.missionBriefing.classList.add("hidden");
  UI.townieSelectionArea.classList.remove("hidden");
  await renderTitleTownie();
});

UI.prevTownieBtn.addEventListener("click",async()=>{activeTownieIndex=(activeTownieIndex-1+TOWNIES.length)%TOWNIES.length;await renderTitleTownie();});
UI.nextTownieBtn.addEventListener("click",async()=>{activeTownieIndex=(activeTownieIndex+1)%TOWNIES.length;await renderTitleTownie();});
UI.startRunBtn.addEventListener("click",async()=>{activeTownieId=TOWNIES[activeTownieIndex].id;UI.titleScreen.classList.add("hidden");UI.gameShell.classList.remove("hidden");await resetGame();});

if(UI.saveScoreBtn) UI.saveScoreBtn.addEventListener("click", savePendingScore);

if(UI.viewLeaderboardBtn) {
  UI.viewLeaderboardBtn.addEventListener("click", ()=>{
    pendingScore = null;
    showLeaderboardScreen(false);
  });
}

if(UI.leaderboardHomeBtn) {
  UI.leaderboardHomeBtn.addEventListener("click", ()=>{
    UI.leaderboardScreen.classList.add("hidden");
    UI.titleScreen.classList.remove("hidden");
    UI.gameShell.classList.add("hidden");
    renderTitleTownie();
  });
}

UI.marketList.addEventListener("click",e=>{const button=e.target.closest("button");if(button)openTrade(button.dataset.action,button.dataset.symbol);});
UI.portfolioList.addEventListener("click",e=>{const button=e.target.closest("button");if(button)openTrade("sell",button.dataset.symbol);});
document.querySelectorAll(".quick-trade-buttons button").forEach(button=>button.addEventListener("click",()=>setTradePercent(Number(button.dataset.percent))));
UI.tradeAmount.addEventListener("input",updateTradeTotal);
UI.confirmTrade.addEventListener("click",confirmTrade);
UI.cancelTrade.addEventListener("click",closeTrade);
UI.timeJump.addEventListener("click",timeJump);
UI.takeLoan.addEventListener("click",takeLoan);
UI.payLoan.addEventListener("click",payLoan);
UI.newGame.addEventListener("click",()=>{UI.titleScreen.classList.remove("hidden");UI.gameShell.classList.add("hidden");renderTitleTownie();});

buildMatrixRain();
typeMissionBriefing();
renderTitleTownie();