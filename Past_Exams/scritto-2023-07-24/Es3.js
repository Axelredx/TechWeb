/*Domanda #3 - Javascript (12 punti)
    Scrivere il codice JS per fare suonare una batteria. Il template e i materiali di
    partenza sono presenti nella cartella DrumKit.zip su EOL.
    • I tasti delle immagini devono essere mappati ai bottoni, ovvero si deve
        poter interagire con la batteria sia tramite click che tramite tastiera.
    • Quando uno dei tasti viene premuto oppure cliccato, bisogna assegnare
        all’immagine la classe ‘pressed’ per generare una animazione.
    • Si può testare in index.js il codice JS, ma tutto il codice deve essere
        incollato qui sotto.
    • Il codice verrà testato nella valutazione.
    • Tip: per utilizzare un file audio, usare il costruttore Audio() in JS.
*/

// Funzione per riprodurre il suono in base al tasto premuto
function playSound(key) {
    let audio;
    switch (key) {
      case 'w':
        audio = new Audio('sounds/tom-1.mp3');
        break;
      case 'a':
        audio = new Audio('sounds/tom-2.mp3');
        break;
      case 's':
        audio = new Audio('sounds/tom-3.mp3');
        break;
      case 'd':
        audio = new Audio('sounds/tom-4.mp3');
        break;
      case 'j':
        audio = new Audio('sounds/snare.mp3');
        break;
      case 'k':
        audio = new Audio('sounds/crash.mp3');
        break;
      case 'l':
        audio = new Audio('sounds/kick-bass.mp3');
        break;
      default:
        return;
    }
    audio.play();
}

// Funzione per aggiungere l'animazione di pressione
function buttonAnimation(currentKey) {
    const activeButton = document.getElementById(currentKey);
    activeButton.classList.add('pressed');
    setTimeout(() => {
        activeButton.classList.remove('pressed');
    }, 100);
}

// Aggiungere event listener per i click sui pulsanti
const buttons = document.querySelectorAll('.drum');
    buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonInnerHTML = button.id;
        playSound(buttonInnerHTML);
        buttonAnimation(buttonInnerHTML);
    });
});

// Aggiungere event listener per la pressione dei tasti
document.addEventListener('keydown', (event) => {
    playSound(event.key);
    buttonAnimation(event.key);
});
