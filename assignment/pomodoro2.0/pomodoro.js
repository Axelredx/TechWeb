const { createApp } = Vue;
const app = createApp({
    data() {
        return {
            startString: 'Start new Pomodoro!',
            numberTom: 5,
            minTom: 25,
            minPause: 5,
            stopped: true,
            timer: '00:00',
            totalCycle: 0,
            interval: null
        };
    },
    methods: {
        Tomato() {
            if (!this.stopped) return;
            this.totalCycle = (this.numberTom * 2) - 1;
            this.startTomato();
        },
        startTomato() {
            this.stopped = false;
            this.runCycle(0);
        },
        runCycle(cycle) {
            if (cycle > this.totalCycle) {
                this.stopped = true;
                return;
            }
            let duration = cycle % 2 === 0 ? this.minTom : this.minPause;
            console.log(cycle % 2 === 0 ? 'tomato session' : 'pause');
            this.startTimer(duration, () => {
                this.runCycle(cycle + 1);
            });
        },
        startTimer(minutes, callback) {
            const endTime = Date.now() + minutes * 60000;
            this.interval = setInterval(() => {
                const now = Date.now();
                const difference = endTime - now;

                if (difference <= 0 || this.stopped) {
                    clearInterval(this.interval);
                    this.timer = '00:00';
                    if (!this.stopped) {
                        callback();
                    }
                    return;
                }

                const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                this.timer = `${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
        },
        stopTimer() {
            console.log('Tomato aborted!');
            this.stopped = true;
            this.timer = '00:00';
            this.totalCycle = 0;
            clearInterval(this.interval);
        },
        skipCycle() {
            console.log('Cycle skipped!');
            this.stopTimer();
            if (this.totalCycle > 0) {
                this.totalCycle--;
                this.runCycle(this.totalCycle);
            }
        },
        redoCycle() {
            console.log('Cycle redone!');
            this.stopTimer();
            this.totalCycle++;
            this.runCycle(this.totalCycle);
        }
    }
});
app.mount('#app');
