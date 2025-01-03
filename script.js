// Initial stat values
let hunger = 100;
let happiness = 100;
let energy = 100;

// Select pet image element
const petImg = document.getElementById("petImg");

// Function to update the status of the pet and its progress bars
function updateStatus() {
  // Select progress bar elements
  const hungerBar = document.getElementById('hunger-bar');
  const happinessBar = document.getElementById('happiness-bar');
  const energyBar = document.getElementById('energy-bar');

  // Update the progress bars based on stats
  hungerBar.style.width = hunger + '%';
  happinessBar.style.width = happiness + '%';
  energyBar.style.width = energy + '%';

  // Update pet image based on stats
  updatePetImage();
}

// Function to update the pet's image based on its current state
function updatePetImage() {
  if (happiness > 90) {
    petImg.src = 'images/happy.png'; // Happy image
  } else if (happiness < 20) {
    petImg.src = 'images/sad.png'; // Sad image
  } else if (hunger === 0 || happiness === 0 || energy === 0) {
    petImg.src = 'images/sad.png'; // If dead or too low in any stat, sad image
  } else if (energy < 30) {
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
  updateStatus();  // Update the progress bars and image after feeding
}

// Play with the pet (increase happiness)
function playWithPet() {
  if (happiness < 100) {
    happiness += 10;
  }
  updateStatus();  // Update the progress bars and image after playing
}

// Pet goes to sleep (increase energy)
function sleepPet() {
  if (energy < 100) {
    energy += 10;
  }
  updateStatus();  // Update the progress bars and image after sleeping
}

// Decrease stats over time (simulating aging or natural stat decay)
function decreaseStats() {
  // Decrease hunger, happiness, and energy over time
  if (hunger > 0) hunger -= 0.05;
  if (happiness > 0) happiness -= 0.05;
  if (energy > 0) energy -= 0.05;

  // Update status and check if the pet is still alive
  updateStatus();

  // Check if pet is dead (all stats are zero or below)
  if (hunger <= 0 || happiness <= 0 || energy <= 0) {
    alert("Your Townie has passed away... :( So sad. Refresh to try again!");
  }
}

// Call decreaseStats every 1 second to simulate pet’s natural decay
setInterval(decreaseStats, 1000);

// Initial call to set up the pet's status and progress bars
updateStatus();


