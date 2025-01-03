// Initial stat values
let hunger = 100;
let happiness = 100;
let energy = 100;

// Select pet image element
const petImg = document.getElementById("petImg");

// Function to update the status of the pet and its progress bars
function updateStatus() {
  const hungerBar = document.getElementById('hunger-bar');
  const happinessBar = document.getElementById('happiness-bar');
  const energyBar = document.getElementById('energy-bar');
  
  // Select progress text elements
  const hungerText = document.getElementById('hunger-text');
  const happinessText = document.getElementById('happiness-text');
  const energyText = document.getElementById('energy-text');

  // Update the progress bars based on stats
  hungerBar.style.width = hunger + '%';
  happinessBar.style.width = happiness + '%';
  energyBar.style.width = energy + '%';

  // Update the progress text inside each bar
  hungerText.textContent = Math.round(hunger) + '%';
  happinessText.textContent = Math.round(happiness) + '%';
  energyText.textContent = Math.round(energy) + '%';

  // Update pet image based on stats
  updatePetImage();
}

// Function to update the pet's image based on its current state
function updatePetImage() {
  if (happiness > 90) {
    petImg.src = 'images/happy.png'; // Happy image
  } else if (happiness < 20 || hunger === 0 || happiness === 0 || energy === 0) {
    petImg.src = 'images/sad.png'; // Sad image
  } else if (energy < 50) {
    petImg.src = 'images/sleeping.png'; // Sleeping image if energy is low
  } else {
    petImg.src = 'images/neutral.png'; // Neutral image
  }
}

// Feed the pet (increase hunger, but don't exceed 100)
function feedPet() {
  if (hunger < 100) {
    hunger += 10;
  }
  updateStatus();  // Refresh everything
}

// Play with the pet (increase happiness)
function playWithPet() {
  if (happiness < 100) {
    happiness += 10;
  }
  updateStatus();  // Refresh everything
}

// Pet goes to sleep (increase energy)
function sleepPet() {
  if (energy < 100) {
    energy += 10;
  }
  updateStatus();  // Refresh everything
}

// Decrease stats over time (simulating aging or natural stat decay)
function decreaseStats() {
  if (hunger > 0) {
    hunger -= 0.05; // Decrease hunger
  }
  if (happiness > 0) {
    happiness -= 0.05; // Decrease happiness
  }
  if (energy > 0) {
    energy -= 0.05; // Decrease energy
  }

  // Update everything after the stats decrease
  updateStatus();

  //
