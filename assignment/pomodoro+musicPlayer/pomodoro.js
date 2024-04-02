document.getElementById('studyForm').addEventListener('submit', function(event) {
    // Previene il comportamento di default dell'evento, che sarebbe il submit del form
    event.preventDefault();
  
    // Ottiene il tempo di studio inserito dall'utente e lo converte in un numero intero
    const studyTime = parseInt(document.getElementById('studyTime').value, 10);
    // Converte i minuti in secondi per l'animazione
    const animationDuration = studyTime * 60; 
  
    // Imposta l'animazione con durata dinamica per gli pseudo-elementi ::before e ::after
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      .blob::before, .blob::after {
        animation: rotate ${animationDuration}s linear forwards;
      }
    `;
    // Aggiunge il foglio di stile creato all'elemento head del documento
    document.head.appendChild(styleSheet);
  
    // Calcola il tempo di fine aggiungendo la durata del timer al tempo corrente
    const endTime = Date.now() + studyTime * 60000; 
  
    // Imposta un intervallo che si ripete ogni secondo
    const interval = setInterval(function() {
      const now = Date.now();
      // Calcola la differenza tra il tempo di fine e il tempo corrente
      const difference = endTime - now;
      
      // Se la differenza è minore o uguale a 0, ferma l'intervallo
      if (difference <= 0) {
        clearInterval(interval);
        // Pulisce il testo dell'elemento con id 'timerDisplay'
        document.getElementById('timerDisplay').textContent = ""; 
        return;
      }
  
      // Calcola i minuti e i secondi rimanenti
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      // Visualizza il tempo rimanente nell'elemento con id 'timerDisplay'
     //padstart aggiunge uno zero prima della stringa se non raggiunge almeno una lunghezza di 2
      document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  });