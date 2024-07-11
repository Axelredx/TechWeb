const musicPlayer = document.getElementById('musicPlayer');
const playButton = document.getElementById('playButton');
const volumeControl = document.getElementById('volumeControl');
const progressSlider = document.getElementById('progressSlider');
const currentTimeDisplay = document.getElementById('currentTime');

let isPlaying = false;

// Play or pause the music when the play button is clicked
playButton.addEventListener('click', function() {
    if (isPlaying) {
        musicPlayer.pause();
    } else {
        musicPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayPauseIcon();
});

// Update the play/pause button icon based on the current playback state
function updatePlayPauseIcon() {
    if (isPlaying) {
        playButton.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
    } else {
        playButton.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
    }
}

// Update the volume when the volume control slider is adjusted
volumeControl.addEventListener('input', function() {
    musicPlayer.volume = volumeControl.value;
});

// Update the current playback time when the progress slider is adjusted
progressSlider.addEventListener('input', function() {
    const newTime = (musicPlayer.duration / 100) * progressSlider.value;
    musicPlayer.currentTime = newTime;
});

// Update the progress slider and current time display as the music plays
musicPlayer.addEventListener('timeupdate', function() {
    const progress = (musicPlayer.currentTime / musicPlayer.duration) * 100;
    progressSlider.value = progress;
    currentTimeDisplay.textContent = formatTime(musicPlayer.currentTime);
});

// Format the time in minutes and seconds
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
