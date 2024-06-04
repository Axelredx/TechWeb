/*  Scrivere il codice JS necessario per poter effettuare una chiamata POST ad
    un’API ipotetica chiamata “js2py”. L’API js2py prende in input un codice JS
    di massimo 512 caratteri e lo “traduce” in Python. L’API, oltre a gestire il body
    della richiesta, può accettare ulteriori parametri come “strictness” (tra 1-10), la
    versione di Python in cui tradurre il codice (stringa, e.g. “3.11.5”), e la
    possibilità di utilizzare o meno librerie esterne per tradurre il codice
    (true-false).
    L’URI dell’API è il seguente:
        https://api.example.com/js2py/translate/
        Esempio del body della richiesta:
        const requestBody = {
        js_code: jsCode,
        strictness: strictness,
        python_version: pythonVersion,
        use_external_libs: useExternalLibs,
        };
*/
// Definire i parametri della richiesta
const jsCode = "console.log('Hello, world!');";  // Codice JS di esempio, massimo 512 caratteri
const strictness = 5;  // Livello di severità tra 1-10
const pythonVersion = "3.11.5";  // Versione di Python
const useExternalLibs = true;  // Utilizzo di librerie esterne

// Costruire il body della richiesta
const requestBody = {
    js_code: jsCode,
    strictness: strictness,
    python_version: pythonVersion,
    use_external_libs: useExternalLibs,
};

// Effettuare la chiamata POST -> 'fetch(url, opt).then()'
fetch("https://api.example.com/js2py/translate/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    console.log('Success:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/*  Spiegazione del Codice:
    Definizione dei Parametri:
        jsCode: il codice JavaScript da tradurre (massimo 512 caratteri).
        strictness: livello di severità (tra 1 e 10).
        pythonVersion: la versione di Python in cui tradurre il codice.
        useExternalLibs: booleano per specificare se utilizzare librerie esterne.

    Creazione del Body della Richiesta:
        Il body della richiesta viene creato come un oggetto JavaScript e poi convertito in una 
        stringa JSON con JSON.stringify.

    Esecuzione della Chiamata POST:
        fetch viene utilizzato per inviare una richiesta POST all'endpoint specificato.
        headers: specifica che il contenuto del body è in formato JSON.
        body: contiene il body della richiesta in formato JSON.

    Gestione della Risposta:
        Se la risposta non è OK (200-299), viene lanciato un errore.
        Se la risposta è OK, viene convertita in JSON.
        Il risultato della traduzione viene stampato nella console.
        Gli errori vengono catturati e stampati nella console.
 */