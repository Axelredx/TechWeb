<script setup>
  import { ref } from 'vue';

  const startString = ref('Start!');
  const numberTom = ref(5);
  const minTom = ref(25);
  const minPause = ref(5);
  const stopped = ref(true);
  const timer = ref('00:00');
  const totalCycle = ref(0);
  const totCopy = ref(0);
  let interval = null;
  const isTomato = ref(false);
  const isPause = ref(false);

  // Functions dedicated to showing SVGs
  const showTomatoSvg = () => {
    isTomato.value = !isTomato.value;
    isPause.value = false;
  };

  const showPauseSvg = () => {
    isPause.value = !isPause.value;
    isTomato.value = false;
  };

  // func. for general tomato cycle
  const Tomato = () => {
    if (!stopped.value) return;
    totalCycle.value = (numberTom.value * 2) - 1;
    totCopy.value = totalCycle.value;
    startTomato();
  };

  const startTomato = () => {
    stopped.value = false;
    runCycle(0);
  };

  //func. for regolating cycles
  const runCycle = (cycle) => {
    console.log('cycle remaining: ' + totCopy.value);
    if (cycle > totalCycle.value) {
      stopped.value = true;
      return;
    }
    let duration = cycle % 2 === 0 ? minTom.value : minPause.value;
    if(cycle % 2 === 0){
      showTomatoSvg();
    }else{
      showPauseSvg();
    }
    console.log(cycle % 2 === 0 ? 'tomato session' : 'pause');
    startTimer(duration, () => {
      totCopy.value--;
      runCycle(cycle + 1);
    });
  };

  const startTimer = (minutes, callback) => {
    const endTime = Date.now() + minutes * 60000;
    interval = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0 || stopped.value) {
        clearInterval(interval);
        timer.value = '00:00';
        if (!stopped.value) {
          callback();
        }
        return;
      }

      const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      timer.value = `${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  };

  //fuc.s dedicated to buttons
  const stopTimer = () => {
    if (totalCycle.value <= 0) {
      isTomato.value = false;
      isPause.value = false;
      console.log('Cant stop cycle!');
      return;
    }
    stopped.value = true;
    timer.value = '00:00';
    totalCycle.value = 0;
    totCopy.value = 0;
    clearInterval(interval);
  };

  const skipCycle = () => {
    if (totalCycle.value <= 0) {
      console.log('Cant skip cycle!');
      return;
    }
    console.log('Cycle skipped!');
    let cycle = totCopy.value - 2;
    stopTimer();
    if (cycle > 0) {
      totCopy.value = cycle;
      totalCycle.value = cycle;
      isTomato.value = false;
      isPause.value = false;
      startTomato();
    } else {
      isTomato.value = false;
      isPause.value = false;
      console.log('Tomato aborted, all cycle remaining has been skipped!');
    }
  };

  const redoCycle = () => {
    if (totalCycle.value <= 0) {
      isTomato.value = false;
      isPause.value = false;
      console.log('Cant redo cycle!');
      return;
    }
    console.log('Cycle redone! (added a tomato + pause cycle)');
    let cycle = totCopy.value;
    stopTimer();
    totCopy.value = cycle + 2;
    totalCycle.value = cycle + 2;
    isTomato.value = false;
    isPause.value = false;
    startTomato();
  };

  const abortCycle = () => {
    if (totalCycle.value <= 0) {
      isTomato.value = false;
      isPause.value = false;
      console.log('Cant abort/stop cycle!');
      return;
    }
    stopTimer();
    console.clear();
    console.log('Cycle! aborted');
    isTomato.value = false;
    isPause.value = false;
  }

</script>

<template>
  <div class="pomodoro">
      <form id="studyForm" @submit.prevent="Tomato">
          <div class="form-floating">
              <input class="form-control" placeholder="Number of tomatoes" v-model.number="numberTom" type="number" min="1" required>
              <label>Number of Cycles</label>
          </div>
          <div class="form-floating">
              <input class="form-control" placeholder="Minutes of tomatoes" v-model.number="minTom" type="number" min="1" required>
              <label>Min. of Tomatoes</label>
          </div> 
          <div class="form-floating">
              <input class="form-control" placeholder="Minutes of pauses" v-model.number="minPause" type="number" min="1" required>
              <label >Min. of Pauses</label>
          </div>
          <button type="submit" class="btn btn-primary" id="form-btn">
              {{ startString }} <img src="@/assets/stopwatch.svg" alt="Stop"/>
          </button>
      </form>
      <div id="visual"> 
          <div id="clock" v-if="isTomato == false && isPause == false">
            <div id="timer">{{timer}}</div> 
          </div>
          <div id="clock_tomato" v-if="isTomato == true && isPause == false">
            <div id="timer">{{timer}}</div> 
          </div>
          <div id="clock_pause" v-if="isPause == true && isTomato == false">
            <div id="timer">{{timer}}</div> 
          </div>     
          <div id="buttons">
                <button @click="abortCycle" type="button" class="btn btn-danger" id="stop-btn">
                      Stop Studying! <img src="@/assets/slash-circle.svg" alt="Skip"/>
                </button>
                <button @click="skipCycle" type="button" class="btn btn-warning" id="skip-btn">
                    Skip a Cycle! <img src="@/assets/skip-forward-fill.svg" alt="Skip"/>
                </button>
                <button @click="redoCycle" type="button" class="btn btn-light" id="redo-btn">
                    Redo a Cycle! <img src="@/assets/redo.svg" alt="Skip"/>
                </button>
          </div>       
      </div>
  </div>
</template>

<style scope>
  .pomodoro{
      display: flex;
      flex-direction: column;
      width: 500px;
      height: 500px;
      border: solid black;
      border-radius:10px;
      align-items: center;
      background-color: white;
  }

  #studyForm{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin: 5px;
      /*border: solid black;*/
  }

  #visual{
      width: 400px;
      height: 400px;
      display: flex;
      flex-direction: column;
      /*justify-content: center;*/
      align-items: center;
      background-image: url(https://site212248.tw.cs.unibo.it/img/tomato.png);
      background-size: 100% 100%;
      background-position: center;
      /*border: solid black;*/
  }

  #clock, #clock_tomato, #clock_pause {
      font-weight: bold;
      font-size: 4em;
      color: whitesmoke;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px;
      text-shadow: 
          -1px -1px 0 black,  
          1px -1px 0 black,
          -1px 1px 0 black,
          1px 1px 0 black;
      /*margin-top: 70px;*/
      background-size: 100% 100%;
      background-position: center;
      height: 30vh;
      width: 30vw;
      border-radius: 200px;
      margin-bottom: 50px;
      transform-origin: center;
      animation: rotate-background 10s linear infinite;
      /*border: solid black;*/
  }

  #clock_tomato{
    background-image: url(@/assets/fire.svg);
  }

  #clock_pause{
    background-image: url(@/assets/hand-green.svg);
  }

  #buttons{
      display: flex;
      justify-content: center;
      align-items: center;
      /*border: solid black;*/
  }

  button, .form-floating{
      margin: 1px;
  }

  /*css animation*/
  #timer{
    animation: counter-rotate 10s linear infinite;
  }

  @keyframes rotate-background {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /*to make timer still*/
  @keyframes counter-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
</style>