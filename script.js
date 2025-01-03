// Set initial levels
let hunger = 100;
let happiness = 100;
let energy = 100;

// Get elements from the DOM
const hungerLevel = document.getElementById('hungerLevel');
const happinessLevel = document.getElementById('happinessLevel');
const energyLevel = document.getElementById('energyLevel');
const petImg = document.getElementById('petImg');

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

// Update the Townie image based on its state
function updatePetImage() {
    console.log(`Hunger: ${hunger}, Happiness: ${happiness}, Energy: ${energy}`); // Log current stats
    if (hunger === 0 || happiness === 0 || energy === 0) {
      petImg.src = 'images/sad.png'; // Show sad image if the Townie is "dead"
      console.log('Showing sad image');
    } else if (energy === 100 && happiness === 100) {
      petImg.src = 'images/happy.png'; // Show happy image if everything is full
      console.log('Showing happy image');
    } else if (energy < 50) {
      petImg.src = 'images/sleeping.png'; // Show sleeping image if low energy
      console.log('Showing sleeping image');
    } else {
      petImg.src = 'images/neutral.png'; // Default neutral image
      console.log('Showing neutral image');
    }
  }  

// Feed the Townie
feedBtn.addEventListener('click', () => {
    hunger = Math.min(100, hunger + 20); // Increase hunger level
    energy = Math.min(100, energy + 10); // Slightly increase energy
    updateStatus();
    updatePetImage();  // Update image after feeding
    checkIfDead();
  });
  
  // Play with the Townie
  playBtn.addEventListener('click', () => {
    if (energy > 20) {
      happiness = Math.min(100, happiness + 30); // Increase happiness
      energy -= 20; // Decrease energy
      updateStatus();
      updatePetImage();  // Update image after playing
      checkIfDead();
    } else {
      alert("You need more energy to play!");
    }
  });
  
  // Put the Townie to sleep
  sleepBtn.addEventListener('click', () => {
    energy = Math.min(100, energy + 40); // Restore energy
    hunger = Math.max(0, hunger - 10); // Decrease hunger slightly
    updateStatus();
    updatePetImage();  // Update image after sleeping
    checkIfDead();
  });  

// Decrease hunger, happiness, and energy over time
function decreaseStats() {
  hunger = Math.max(0, hunger - 1);
  happiness = Math.max(0, happiness - 1);
  energy = Math.max(0, energy - 1);
  updateStatus();
  updatePetImage(); // Update image as stats change
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
  updatePetImage();  // Reset image to neutral
}

// Decrease stats every second
setInterval(decreaseStats, 1000);

updateStatus();
updatePetImage();  // Initial image setup

