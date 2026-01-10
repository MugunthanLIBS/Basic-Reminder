// App state
let simulatedTime = new Date();
let fastMode = false;
let reminders = [];
let clockInterval;

// DOM elements
const timeDisplay = document.getElementById('time-display');
const fastIndicator = document.getElementById('fast-indicator');
const fastModeBtn = document.getElementById('fast-mode-btn');
const remindersList = document.getElementById('reminders-list');
const reminderTextInput = document.getElementById('reminder-text');
const reminderTimeInput = document.getElementById('reminder-time');
const addReminderBtn = document.getElementById('add-reminder-btn');

// Initialize the clock
function initClock() {
    updateTimeDisplay();
    
    // Set up the clock interval
    clearInterval(clockInterval);
    clockInterval = setInterval(updateClock, 1000);
}

// Update the clock based on fast mode
function updateClock() {
    if (fastMode) {
        simulatedTime = new Date(simulatedTime.getTime() + 60000);
    } else {
        simulatedTime = new Date();
    }
    
    updateTimeDisplay();
    checkReminders();
}

// Update the time display
function updateTimeDisplay() {
    const timeString = simulatedTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    timeDisplay.textContent = timeString;
    
    // Show/hide fast indicator
    fastIndicator.style.display = fastMode ? 'inline-block' : 'none';
    
    // Update button state
    fastModeBtn.classList.toggle('active', fastMode);
}

// Toggle fast mode
function toggleFastMode() {
    fastMode = !fastMode;
    
    // If switching to fast mode, use current time as starting point
    if (fastMode) {
        simulatedTime = new Date();
    }
    
    // Update button tooltip
    fastModeBtn.title = fastMode ? 
        'Fast mode ON (1 minute per second). Click to turn off.' : 
        'Fast mode OFF (real time). Click to turn on.';
    
    updateTimeDisplay();
}

// Check reminders and mark as done if time has passed
function checkReminders() {
    let updated = false;
    
    reminders.forEach(reminder => {
        if (!reminder.done && simulatedTime >= reminder.reminderTime) {
            reminder.done = true;
            updated = true;
        }
    });
    
    if (updated) {
        renderReminders();
    }
}

// Add reminder
function addReminder() {
    const text = reminderTextInput.value.trim();
    const time = reminderTimeInput.value;
    
    // Validation
    if (!text) {
        alert('Please enter reminder text');
        return;
    }
    
    if (!time) {
        alert('Please select a time');
        return;
    }
    
    // Parse time and create reminder time
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date(simulatedTime);
    reminderTime.setHours(hours, minutes, 0, 0);
    
    // Add reminder to array
    reminders.push({
        text: text,
        reminderTime: reminderTime,
        done: false
    });
    
    // Sort reminders by time (earliest first)
    reminders.sort((a, b) => a.reminderTime - b.reminderTime);
    
    // Clear inputs
    reminderTextInput.value = '';
    reminderTimeInput.value = '';
    
    // Update UI
    renderReminders();
    updateAddButtonState();
}

// Render reminders list
function renderReminders() {
    // Clear the list
    remindersList.innerHTML = '';
    
    if (reminders.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-reminders';
        emptyItem.textContent = 'No reminders yet. Add one below!';
        remindersList.appendChild(emptyItem);
        return;
    }
    
    // Add each reminder to the list
    reminders.forEach((reminder, index) => {
        const reminderItem = document.createElement('li');
        reminderItem.className = `reminder-item ${reminder.done ? 'done' : ''}`;
        
        const timeString = reminder.reminderTime.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        reminderItem.innerHTML = `
            <div class="reminder-text">${reminder.text}</div>
            <div class="reminder-time">${timeString}</div>
        `;
        
        remindersList.appendChild(reminderItem);
    });
}

// Update add button state based on input
function updateAddButtonState() {
    const hasText = reminderTextInput.value.trim() !== '';
    const hasTime = reminderTimeInput.value !== '';
    
    addReminderBtn.disabled = !(hasText && hasTime);
}



// Event listeners setup
function setupEventListeners() {
    fastModeBtn.addEventListener('click', toggleFastMode);
    
    addReminderBtn.addEventListener('click', addReminder);
    
    reminderTextInput.addEventListener('input', updateAddButtonState);
    reminderTimeInput.addEventListener('input', updateAddButtonState);
    
    // Allow pressing Enter to add reminder
    reminderTextInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addReminder();
        }
    });
    
    reminderTimeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addReminder();
        }
    });
}

// Initialize the app
function initApp() {
    setupEventListeners();
    initClock();
    addExampleReminders();
    renderReminders();
    updateAddButtonState();
}

// Start the app when the page loads
window.addEventListener('DOMContentLoaded', initApp);