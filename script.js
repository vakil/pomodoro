let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const workButton = document.getElementById('work');
const restButton = document.getElementById('rest');
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const taskModal = document.getElementById('task-modal');
const taskInput = document.getElementById('task-input');
const submitTasks = document.getElementById('submit-tasks');
const taskList = document.getElementById('task-list');
let tasks = [];

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display in the timer div
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the browser title
    document.title = `(${timeString}) ${isWorkTime ? 'Work' : 'Break'} - Focus Timer`;
}

function startTimer() {
    if (timerId === null) {
        if (tasks.length === 0) {
            showTaskModal();
            return;
        }
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
                statusText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
                updateDisplay();
                alert(isWorkTime ? 'Work Time!' : 'Break Time!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    statusText.textContent = 'Work Time';
    // Clear tasks
    tasks = [];
    taskList.innerHTML = '';
    updateDisplay();
}

function setWorkMode() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    statusText.textContent = 'Work Time';
    updateDisplay();
    updateButtonStyles();
}

function setRestMode() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = false;
    timeLeft = 5 * 60;
    statusText.textContent = 'Break Time';
    updateDisplay();
    updateButtonStyles();
}

function updateButtonStyles() {
    if (isWorkTime) {
        workButton.classList.add('active');
        restButton.classList.remove('active');
    } else {
        workButton.classList.remove('active');
        restButton.classList.add('active');
    }
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update toggle button icon
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    toggleIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
function initializeTheme() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = prefersDarkScheme.matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Initialize
timeLeft = 25 * 60;
updateDisplay();
updateButtonStyles();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
restButton.addEventListener('click', setRestMode);
themeToggle.addEventListener('click', toggleTheme);
initializeTheme();
submitTasks.addEventListener('click', handleTaskSubmit);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleTaskSubmit();
    }
});

function showTaskModal() {
    taskModal.style.display = 'flex';
    taskInput.focus();
}

function hideTaskModal() {
    taskModal.style.display = 'none';
}

function handleTaskSubmit() {
    tasks = taskInput.value
        .split('\n')
        .filter(task => task.trim() !== '')
        .map(task => task.trim());

    if (tasks.length > 0) {
        displayTasks();
        hideTaskModal();
        startTimer();
    }
}

function displayTasks() {
    taskList.innerHTML = `
        <ul>
            ${tasks.map(task => `<li>${task}</li>`).join('')}
        </ul>
    `;
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        hideTaskModal();
    }
}

function handleClickOutside(event) {
    if (event.target === taskModal) {
        hideTaskModal();
    }
}

// Add these to your existing event listeners
document.addEventListener('keydown', handleEscapeKey);
taskModal.addEventListener('click', handleClickOutside); 