let stopped = false;
let nRun = 0;
let interval;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('studyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        let numberTom = parseInt(document.getElementById('numberTom').value, 10);
        let minTom = parseInt(document.getElementById('minTom').value, 10);
        let minPause = parseInt(document.getElementById('minPause').value, 10);
        //total number between pauses and tomato
        let totTom = numberTom + (numberTom-1);
        startTomatoSession(totTom, minTom, minPause);
    });
});

function startTomatoSession(numberTom, minTom, minPause) {
    stopped = false; // Reset stopped flag
    nRun = 0; // Reset tomato counter
    startTomato(minTom, minPause, numberTom, 'tomato');
}

function startTomato(minTom, minPause, remaining, type) {
    nRun++;
    showSpinner();
    console.log(`${type} started. Remaining: ${remaining}`);
    startTimer(minTom, function() {
        hideSpinner();
        console.log(`${type} finished. Remaining: ${remaining}`);
        remaining--;
        if (remaining > 0) {
            setTimeout(() => {
                if (type === 'tomato') {
                    startTomato(minPause, minTom, remaining, 'pause');
                } else {
                    startTomato(minTom, minPause, remaining, 'tomato');
                }
            }, (type === 'tomato' ? minPause : minTom) * 60000);
        }else{
            return;
        }
    });
}

function startTimer(minutes, callback) {
    const endTime = Date.now() + minutes * 60000;
    interval = setInterval(function() {
        const now = Date.now();
        const difference = endTime - now;
        
        if (difference <= 0 || stopped) {
            clearInterval(interval);
            document.getElementById('timerDisplay').textContent = "00:00";
            if (callback) callback();
            return;
        }

        const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        document.getElementById('timerDisplay').textContent = `${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000); 
}

function stopTimer() {
    stopped = true;
}

function showSpinner() {
    const spinner = document.getElementById('spinner-s');
    spinner.classList.remove('d-none');
}

function hideSpinner() {
    const spinner = document.getElementById('spinner-s');
    spinner.classList.add('d-none');
}