let townieAgeInSeconds = 0;
let townieAlive = true;
let townieHealth = 100;
let townieMood = 'Happy';
let bodyType = 'OG'; // Default body type

// Start the timer
function startTimer() {
    setInterval(() => {
        if (townieAlive) {
            townieAgeInSeconds++;
            updateAgeDisplay();
            updateHealth();
        }
    }, 1000); // Increment every second
}

// Update age display
function updateAgeDisplay() {
    const ageDisplay = document.getElementById('age');

    let seconds = townieAgeInSeconds;
    let timeString = '';
    
    if (seconds < 60) { // Less than 1 minute
        timeString = `${seconds} second(s)`;
    } else if (seconds >= 60 && seconds < 3600) { // Less than 1 hour
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        timeString = `${minutes} minute(s) ${remainingSeconds} second(s)`;
    } else if (seconds >= 3600 && seconds < 86400) { // Less than 1 day
        let hours = Math.floor(seconds / 3600);
        let remainingSeconds = seconds % 3600;
        let minutes = Math.floor(remainingSeconds / 60);
        timeString = `${hours} hour(s) ${minutes} minute(s)`;
    } else if (seconds >= 86400 && seconds < 604800) { // Less than 1 week
        let days = Math.floor(seconds / 86400);
        let remainingSeconds = seconds % 86400;
        let hours = Math.floor(remainingSeconds / 3600);
        timeString = `${days} day(s) ${hours} hour(s)`;
    } else if (seconds >= 604800 && seconds < 31536000) { // Less than 1 year
        let days = Math.floor(seconds / 86400);
        timeString = `${days} day(s)`;
    } else { // 1 year or more
        let years = Math.floor(seconds / 31536000);
        let remainingSeconds = seconds % 31536000;
        let days = Math.floor(remainingSeconds / 86400);
        timeString = `${years} year(s) ${days} day(s)`;
    }

    // Update display
    ageDisplay.textContent = `Age: ${timeString}`;
}

// Update health (can be expanded based on game mechanics)
function updateHealth() {
    const healthDisplay = document.getElementById('health');
    healthDisplay.textContent = `Health: ${townieHealth}%`;
}

// Change body type based on user selection
function changeBodyType(type) {
    bodyType = type;
    const townieImage = document.getElementById('townie-image');
    
    if (bodyType === 'OG') {
        townieImage.src = 'images/OG.png';
    } else if (bodyType === 'Zombie') {
        townieImage.src = 'images/Zombie.png';
    }
}

let pantsType = ''; // Track the selected pants type

// Function to change pants
function changePants(type) {
    pantsType = type;
    const townieImage = document.getElementById('townie-image');
    
    // Add pants image on top of the pet
    const pantsImage = document.createElement('img');
    pantsImage.src = `images/${pantsType}.png`;
    pantsImage.alt = `${pantsType} image`;
    pantsImage.id = 'pants-image';
    pantsImage.style.position = 'absolute';
    pantsImage.style.bottom = '0px'; // Position the pants at the bottom of the body
    pantsImage.style.left = '0'; // Align left with the body
    pantsImage.style.width = '100px'; // Match the body width (adjust if necessary)
    pantsImage.style.zIndex = '1';
    
    // Remove any previous pants if selected
    const previousPants = document.getElementById('pants-image');
    if (previousPants) {
        previousPants.remove();
    }

    // Append the new pants image
    townieImage.parentNode.appendChild(pantsImage);
}

startTimer();
