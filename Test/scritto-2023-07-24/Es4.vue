/*Domanda #4 - Framework (6 punti)
    Creare una semplice lista di attività (To-Do List) utilizzando un framework
    web a vostra scelta. La lista deve consentire all’utente di aggiungere nuove
    attività, contrassegnarle come completate e infine rimuoverle. Bisogna
    interagire con la lista senza ricaricare la pagina.
    • Si parta da un framework a vostra scelta, e.g. React, Angular, Vue,
        Svelte, etc.
    • E’ possibile suddividere la soluzione in più componenti, ma devono
        essere tutti richiamati nel componente padre.
    • Il componente riceve un array di oggetti immagine di partenza; ogni
        oggetto è composto dall’URL dell’immagine, titolo e descrizione.
    • La galleria mostra un’immagine alla volta. Oltre all’immagine, titolo e
        descrizione, ci deve essere un modo per navigare tra un’immagine e
        l’altra.
    • Si può usare questo screenshot per immaginare il risultato:
        Punti chiave:
        • Si assuma di poter partire dalla configurazione standard di un progetto
        • Si implementi la lista partendo da una lista vuota; deve essere possibile
            aggiungere nuove attività, e subito vederle come disponibili sulla lista.
        • L’utente deve poter creare un nuovo item e metterlo in lista. Deve
            esserci dunque sia l’input per un nuovo list item sia un pulsante per
            aggiungerlo.
*/

//app.vue:
    <template>
    <div id="app">
        <TodoList />
    </div>
    </template>

    <script>
    import TodoList from './components/TodoList.vue';

    export default {
    name: 'App',
    components: {
        TodoList
    }
    }
    </script>

    <style>
    #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    }
    </style>


//todolist.vue:
    <template>
    <div class="todo-list">
        <h1>To-Do List</h1>
        <input v-model="newTodo" placeholder="Add a new task">
        <button @click="addTodo">Add</button>
        <div v-for="(todo, index) in todos" :key="index">
        <TodoItem
            :todo="todo"
            :index="index"
            @toggle-complete="toggleComplete"
            @remove-todo="removeTodo"
        />
        </div>
    </div>
    </template>

    <script>
    import TodoItem from './TodoItem.vue';

    export default {
    components: {
        TodoItem
    },
    data() {
        return {
        newTodo: '',
        todos: []
        }
    },
    methods: {
        addTodo() {
        if (this.newTodo.trim() !== '') {
            this.todos.push({ text: this.newTodo, completed: false });
            this.newTodo = '';
        }
        },
        toggleComplete(index) {
        this.todos[index].completed = !this.todos[index].completed;
        },
        removeTodo(index) {
        this.todos.splice(index, 1);
        }
    }
    }
    </script>

    <style scoped>
    .todo-list {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
    }
    .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    }
    </style>


//todoitem,vue:
    <template>
    <div class="todo-item">
        <input type="checkbox" v-model="todo.completed" @change="toggleComplete">
        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
        <button @click="removeTodo">Remove</button>
    </div>
    </template>

    <script>
    export default {
    props: {
        todo: {
        type: Object,
        required: true
        },
        index: {
        type: Number,
        required: true
        }
    },
    methods: {
        toggleComplete() {
        this.$emit('toggle-complete', this.index);
        },
        removeTodo() {
        this.$emit('remove-todo', this.index);
        }
    }
    }
    </script>

    <style scoped>
    .completed {
    text-decoration: line-through;
    }
    </style>
