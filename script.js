let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let breakTime = 0;
let workPeriods = [];

const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const breakInfo = document.getElementById("break-info");
const breakDuration = document.getElementById("break-duration");
const startBreakButton = document.getElementById("start-break");
const previousWorkPeriodsElement = document.getElementById("previous-work-periods");
const cycleDisplay = document.getElementById("cycle-display");
const yearElement = document.getElementById("year");

// for Copyright year
const date = new Date();
const year = date.getFullYear();
yearElement.innerHTML = year;

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
        workPeriods.push(elapsedTime); // Save work period duration to array
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

            const totalWorkTime = workPeriods.reduce((acc, time) => acc + time, 0); // Calculate total work time

            let previousWorkPeriodsText = "";
            for (let i = 0; i < workPeriods.length; i++) {
                const workPeriodTime = workPeriods[i];
                const minutes = Math.floor((workPeriodTime / (1000 * 60)) % 60);
                const seconds = Math.floor((workPeriodTime / 1000) % 60);
                previousWorkPeriodsText += `Cycle ${i + 1} - ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}\n`;
            }
            if (workPeriods.length > 1) { // Check if there's more than one work period
                const totalMinutes = Math.floor((totalWorkTime / (1000 * 60)) % 60);
                const totalSeconds = Math.floor((totalWorkTime / 1000) % 60);
                previousWorkPeriodsText += `Total: ${totalMinutes.toString().padStart(2, "0")}:${totalSeconds.toString().padStart(2, "0")}`;
            }

            cycleDisplay.innerText = previousWorkPeriodsText;
        } else {
            const remainingSeconds = Math.floor(remainingBreakTime / 1000);
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            breakDuration.innerText = `${minutes.toString().padStart(1, "0")} minutes ${seconds.toString().padStart(2, "0")} seconds`;
        }
    }, 1000);

    previousWorkPeriodsElement.style.display = 'block';
}

startButton.addEventListener("click", startTimer);
startBreakButton.addEventListener("click", startBreak);