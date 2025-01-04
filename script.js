// Reference to the townie image and body type select dropdown
const townieImage = document.getElementById("townie-image");
const bodyTypeSelect = document.getElementById("body-type");
const ageDisplay = document.getElementById("age");
const timeDisplay = document.getElementById("time");
const healthDisplay = document.getElementById("health");
const moodDisplay = document.getElementById("mood");

// Initialize pet age and states
let petAgeInSeconds = 0;
let petHealth = 100;
let petMood = "Happy";

// Track the pet's birthday
let petBirthday = new Date();

// Function to change the Townie body type
function changeBodyType() {
    const selectedBody = bodyTypeSelect.value;

    // Check the selected body type and update the image accordingly
    if (selectedBody === "og") {
        townieImage.src = "images/OG.png"; // OG body image path
    } else if (selectedBody === "zombie") {
        townieImage.src = "images/Zombie.png"; // Zombie body image path
    }
}

// Function to calculate the pet's age and update the time
function updateAge() {
    petAgeInSeconds++;

    const seconds = petAgeInSeconds % 60;
    const minutes = Math.floor(petAgeInSeconds / 60) % 60;
    const hours = Math.floor(petAgeInSeconds / 3600) % 24;
    const days = Math.floor(petAgeInSeconds / 86400);
    const years = Math.floor(petAgeInSeconds / 31536000);

    // Display the pet's age based on its duration
    if (petAgeInSeconds < 60) {
        ageDisplay.textContent = `Age: ${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (petAgeInSeconds < 600) { // Less than 10 minutes
        ageDisplay.textContent = `Age: ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (petAgeInSeconds < 86400) { // Less than 1 day
        ageDisplay.textContent = `Age: ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (petAgeInSeconds < 604800) { // Less than 1 week
        ageDisplay.textContent = `Age: ${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (petAgeInSeconds < 31536000) { // Less than 1 year
        ageDisplay.textContent = `Age: ${days} day${days !== 1 ? 's' : ''}`;
    } else { // Over 1 year
        ageDisplay.textContent = `Age: ${years} year${years !== 1 ? 's' : ''} ${days % 365} day${(days % 365) !== 1 ? 's' : ''}`;
    }

    // Update time display
    timeDisplay.textContent = `Alive for: ${ageDisplay.textContent}`;
}

// Function to update health and mood (for demonstration purposes)
function updateHealthAndMood() {
    if (petHealth > 0) {
        petHealth -= 0.1; // Health slowly decreases over time
    }
    if (petHealth < 50) {
        petMood = "Sad";
    } else {
        petMood = "Happy";
    }

    healthDisplay.textContent = `Health: ${petHealth.toFixed(2)}%`;
    moodDisplay.textContent = `Mood: ${petMood}`;
}

// Event listeners for buttons
document.getElementById("feed").addEventListener("click", () => {
    petHealth = Math.min(100, petHealth + 20);
    petMood = "Happy";
    healthDisplay.textContent = `Health: ${petHealth}%`;
    moodDisplay.textContent = `Mood: ${petMood}`;
});

document.getElementById("play").addEventListener("click", () => {
    petMood = "Happy";
    moodDisplay.textContent = `Mood: ${petMood}`;
});

document.getElementById("clean").addEventListener("click", () => {
    petMood = "Happy";
    moodDisplay.textContent = `Mood: ${petMood}`;
});

// Update pet age and health/mood every second
setInterval(() => {
    updateAge();
    updateHealthAndMood();
}, 1000);

// Listen for changes in the body type selection
bodyTypeSelect.addEventListener("change", changeBodyType);

// Set default image to OG when the page loads
townieImage.src = "images/OG.png";
