// Select Elements
const hungerMeter = document.getElementById('hunger');
const happinessMeter = document.getElementById('happiness');
const healthMeter = document.getElementById('health');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const cleanBtn = document.getElementById('clean-btn');
const scoldBtn = document.getElementById('scold-btn');
const praiseBtn = document.getElementById('praise-btn');

// Initial Stats
let hunger = 50;
let happiness = 75;
let health = 90;

// Functions to update meters
function updateMeters() {
    hungerMeter.value = hunger;
    happinessMeter.value = happiness;
    healthMeter.value = health;
}

// Event Listeners
feedBtn.addEventListener('click', () => {
    hunger = Math.min(100, hunger + 10);
    happiness = Math.min(100, happiness + 5);
    updateMeters();
});

playBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 10);
    hunger = Math.max(0, hunger - 5);
    updateMeters();
});

cleanBtn.addEventListener('click', () => {
    health = Math.min(100, health + 10);
    updateMeters();
});

scoldBtn.addEventListener('click', () => {
    happiness = Math.max(0, happiness - 10);
    updateMeters();
});

praiseBtn.addEventListener('click', () => {
    happiness = Math.min(100, happiness + 10);
    updateMeters();
});

// Initial Render
updateMeters();