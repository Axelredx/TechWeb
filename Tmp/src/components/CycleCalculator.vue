<script setup>
    import { ref } from 'vue';  

    const startCalc = ref('Simulate!');
    const totH = ref(1);
    const totM = ref(60);
    const minP = ref(5);
    const cycle = ref(5);
    const minT = ref(25);
    const output = ref(false);

    const calcTomatoH = () =>{
        totM.value = totH.value * 60;
        calcTomatoM();
    }

    const calcTomatoM = () =>{
        cycle.value = Math.floor(totM.value / 30);
        minT.value = 30 - minP.value;
        output.value = true;
        console.log('Pomodoro simulated!');
    }
</script>


<template>
    <div id="container">
        <div id="info-text">
            <p>Try to simulate a Pomodoro! <img src="@/assets/clock2.svg" alt="Clock"/></p>
        </div>
        <div id="calculator_H">
            <form id="studyForm" @submit.prevent="calcTomatoH">
                <div class="form-floating">
                    <input class="form-control" placeholder="Total hours" v-model.number="totH" type="number" min="1" required>
                    <label>Total hours</label>
                </div> 
                <div class="form-floating">
                    <input class="form-control" placeholder="Minutes of pauses" v-model.number="minP" type="number" min="1">
                    <label>Min. of Pauses</label>
                </div>
                <button type="submit" class="btn btn-primary" id="form-btn">
                    {{ startCalc }} <img src="@/assets/help.svg" alt="Help"/>
                </button>
            </form>
        </div>
        <div id="calculator_M">
            <form id="studyForm" @submit.prevent="calcTomatoM">
                <div class="form-floating">
                    <input class="form-control" placeholder="Total minutes" v-model.number="totM" type="number" min="30" required>
                    <label>Total minutes</label>
                </div> 
                <div class="form-floating">
                    <input class="form-control" placeholder="Minutes of pauses" v-model.number="minP" type="number" min="1">
                    <label>Min. of Pauses</label>
                </div>
                <button type="submit" class="btn btn-primary" id="form-btn">
                    {{ startCalc }} <img src="@/assets/help.svg" alt="Help"/>
                </button>
            </form>
        </div>
        <div id="output" v-if="output">
            <p>{{ cycle }} cycles: {{ minT }} minutes tomato session + {{ minP }} minutes of break each cycle</p>
        </div>
    </div>
</template>


<style scoped>
    #container {
        display: flex;
        flex-direction: column;
        width: 30vw;
        height: 41vh;
        border: solid black;
        border-radius: 10px;
        align-items: center;
        background-color: white;
        margin: 2px;
    }

    #studyForm {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 1px;
    }

    #output, #info-text {
        margin: 5px;
    }

    @media (max-width: 950px) {
        #studyForm{
            flex-direction: column;
        }

        #container {
            height: 50vh;
        }
    }

    @media (max-width: 500px) {
        #container{
            width: 90vw;
            height: 35vh;
        }

        #studyForm{
            flex-direction: row;
        }

        #output, #info-text {
            margin: 2px;
        }
    }
</style>
