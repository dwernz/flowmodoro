let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let breakTime = 0;
let tookBreak = false;

const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const breakInfo = document.getElementById("break-info");
const breakDuration = document.getElementById("break-duration");
const startBreakButton = document.getElementById("start-break");

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    timerElement.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now();
        updateTimer();
        intervalId = setInterval(updateTimer, 1000);
        startButton.style.backgroundColor = '#f44336';
        startButton.innerText = 'Pause';
        breakInfo.style.display = "none";
    } else {
        isRunning = false;
        clearInterval(intervalId);
        breakTime = elapsedTime / 5;
        breakDuration.innerText = `${Math.floor(breakTime / (1000 * 60))} minutes ${Math.floor((breakTime / 1000) % 60)} seconds`;
        startBreakButton.disabled = false;
        startButton.style.backgroundColor = '#4caf50';
        startButton.innerText = 'Start';
        breakInfo.style.display = "block";
    }
}

function startBreak() {
    isRunning = true;
    startTime = Date.now();
    startBreakButton.disabled = true;
    intervalId = setInterval(() => {
        const currentTime = Date.now();
        const remainingBreakTime = breakTime - (currentTime - startTime);
        if (remainingBreakTime <= 0) {
            clearInterval(intervalId);
            isRunning = false;
            elapsedTime = 0;
            breakTime = 0;
            timerElement.innerText = "00:00:00";
            breakInfo.style.display = "none";
        } else {
            const remainingSeconds = Math.floor(remainingBreakTime / 1000);
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            breakDuration.innerText = `${minutes.toString().padStart(1, "0")} minutes ${seconds.toString().padStart(2, "0")} seconds`;
        }
    }, 1000);
}

startButton.addEventListener("click", startTimer);
startBreakButton.addEventListener("click", startBreak);