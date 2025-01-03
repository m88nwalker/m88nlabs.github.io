// Set initial levels
let hunger = 100;
let happiness = 100;
let energy = 100;

// Get elements from the DOM
const hungerLevel = document.getElementById('hungerLevel');
const happinessLevel = document.getElementById('happinessLevel');
const energyLevel = document.getElementById('energyLevel');

// Buttons
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');

// Update the status display
function updateStatus() {
  hungerLevel.textContent = hunger;
  happinessLevel.textContent = happiness;
  energyLevel.textContent = energy;
}

// Feed the Townie
feedBtn.addEventListener('click', () => {
  hunger = Math.min(100, hunger + 20); // Increase hunger level
  energy = Math.min(100, energy + 10); // Slightly increase energy
  updateStatus();
  checkIfDead();
});

// Play with the pet
playBtn.addEventListener('click', () => {
  if (energy > 20) {
    happiness = Math.min(100, happiness + 30); // Increase happiness
    energy -= 20; // Decrease energy
    updateStatus();
    checkIfDead();
  } else {
    alert("Your Townie needs more energy to play!");
  }
});

// Put the Townie to sleep
sleepBtn.addEventListener('click', () => {
  energy = Math.min(100, energy + 40); // Restore energy
  hunger = Math.max(0, hunger - 10); // Decrease hunger slightly
  updateStatus();
  checkIfDead();
});

// Decrease hunger, happiness, and energy over time
function decreaseStats() {
  hunger = Math.max(0, hunger - 1);
  happiness = Math.max(0, happiness - 1);
  energy = Math.max(0, energy - 1);
  updateStatus();
  checkIfDead();
}

// Check if the Townie has died
function checkIfDead() {
  if (hunger === 0 || happiness === 0 || energy === 0) {
    alert("Your Townie has passed away... :( So sad. Try again!");
    resetGame();
  }
}

// Reset the game to initial state
function resetGame() {
  hunger = 100;
  happiness = 100;
  energy = 100;
  updateStatus();
}

// Get the image element
const petImg = document.getElementById('petImg');

// Update the image based on the pet's state
function updatePetImage() {
  if (hunger === 0 || happiness === 0 || energy === 0) {
    petImg.src = 'images/sad.png'; // Show sad image if the pet is "dead"
  } else if (energy === 100 && happiness === 100) {
    petImg.src = 'images/happy.png'; // Show happy image if everything is full
  } else if (energy < 50) {
    petImg.src = 'images/sleeping.png'; // Show sleeping image if the pet is low on energy
  } else {
    petImg.src = 'images/neutral.png'; // Show neutral image for regular state
  }
}

// Call updatePetImage when the pet's state changes
feedBtn.addEventListener('click', () => {
  hunger = Math.min(100, hunger + 20);
  energy = Math.min(100, energy + 10);
  updateStatus();
  updatePetImage();  // Update image when fed
});

playBtn.addEventListener('click', () => {
  if (energy > 20) {
    happiness = Math.min(100, happiness + 30);
    energy -= 20;
    updateStatus();
    updatePetImage();  // Update image after playing
  } else {
    alert("You need more energy to play!");
  }
});

sleepBtn.addEventListener('click', () => {
  energy = Math.min(100, energy + 40);
  hunger = Math.max(0, hunger - 10);
  updateStatus();
  updatePetImage();  // Update image after sleeping
});

// Also call updatePetImage on the initial page load
updatePetImage();


// Decrease stats every second
setInterval(decreaseStats, 1000);

updateStatus();
