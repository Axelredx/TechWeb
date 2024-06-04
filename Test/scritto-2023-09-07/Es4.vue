/*  Riprendendo il codice scritto nell’esercizio precedente, creare un componente
    che gestisca l’interfaccia di input e output dell’API di traduzione js2py. Il
    codice va inserito in un input testuale e, una volta ultimata la richiesta,
    restituisce il codice in Python.
    • Si parta da un framework a vostra scelta, e.g. React, Angular, Vue,
        Svelte, etc.
    • E’ possibile suddividere la soluzione in più componenti, ma devono
        essere tutti richiamati nel componente padre.
    • Una volta caricato l’output, un bottone deve poter consentire di copiare
        il testo dell’output.
    • Gestire gli errori e mostrarli all’utente nel caso di fallimento della
        richiesta. Gli errori da gestire sono: 400, 404, 500, 502
    • NB: nel caso in cui l’esercizio precedente non sia stato svolto, scrivere
        tramite commenti la richiesta (anche non funzionante) per cui si abbiano
        tre output differenti a seconda dell’esito della richiesta stessa.
*/

...

<form @submit.prevent="submitForm">
    <div class="form-floating">
        <textarea class="form-control" placeholder="py-code" id="floatingTextarea2" style="height: 100px"></textarea>
        <label for="floatingTextarea2">Insert PY code here</label>
    </div>
    //vari input
    <button type="submit" class="btn btn-primary">Submit Code</button>
</form>

...

<div class="new-code" v-if="response">{{new-code}}</div>

...//script

const response = await fetch("https://api.example.com/js2py/translate/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

...

const data = await response.json();
this.$emit('translate', { data: data.python_code });

...
