let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let sessions = parseInt(localStorage.getItem('pater_sessions')) || 0;
let maxTime = parseInt(localStorage.getItem('pater_maxTime')) || 0;

const timerDisplay = document.getElementById('timer');
const startStopBtn = document.getElementById('start-stop-btn');
const btnText = startStopBtn.querySelector('.btn-text');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const timerCard = document.querySelector('.timer-card');
const sessionCountDisplay = document.getElementById('session-count');
const maxTimeDisplay = document.getElementById('max-time');

// Initialize stats
updateStatsDisplay();

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
}

function updateStatsDisplay() {
    sessionCountDisplay.textContent = sessions;
    maxTimeDisplay.textContent = formatTime(maxTime).substring(3); // Show only MM:SS for record
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 100);
    
    isRunning = true;
    btnText.textContent = 'Arrêter';
    statusText.textContent = 'PATER PARLE';
    timerCard.classList.add('active');
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    btnText.textContent = 'Démarrer';
    statusText.textContent = 'SILENCE';
    timerCard.classList.remove('active');
    
    if (elapsedTime > 0) {
        sessions++;
        if (elapsedTime > maxTime) {
            maxTime = elapsedTime;
            localStorage.setItem('pater_maxTime', maxTime);
        }
        localStorage.setItem('pater_sessions', sessions);
        updateStatsDisplay();
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
}

startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

// Quick reset double click for record (Optional feature)
maxTimeDisplay.parentElement.addEventListener('dblclick', () => {
    if (confirm('Réinitialiser le record ?')) {
        maxTime = 0;
        localStorage.setItem('pater_maxTime', 0);
        updateStatsDisplay();
    }
});
