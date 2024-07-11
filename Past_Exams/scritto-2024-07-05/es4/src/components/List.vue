<script>import { ref } from 'vue';

export default {
  setup() {
    // Define reactive variables
    const Title = ref('');
    const Description = ref('');
    const Date = ref('2000-01-01');
    const Dayleft = ref(0);
    const Site = ref('');
    const Partecipants = ref(1);

    // Event object structure
    const Event = {
      title: Title,
      description: Description,
      date: Date,
      dayleft: Dayleft,
      site: Site,
      partecipants: Partecipants,
    };

    // Array to store events
    const EventList = ref([]);

    // Function to add a new event to EventList
    const AddToList = () => {
      EventList.value.push({
        title: Title.value,
        description: Description.value,
        date: Date.value,
        dayleft: Dayleft.value,
        site: Site.value,
        partecipants: Partecipants.value,
      });

      // Reset form fields after adding event
      Title.value = '';
      Description.value = '';
      Date.value = '2000-01-01';
      Dayleft.value = 0;
      Site.value = '';
      Partecipants.value = 1;
    };

    // Function to delete a specific event from EventList
    const deleteEvent = (index) => {
      EventList.value.splice(index, 1);
    };

    // Function to delete all events from EventList
    const deleteAll = () => {
      EventList.value = [];
    };

    // Return variables and functions to be used in template
    return {
      Title,
      Description,
      Date,
      Dayleft,
      Site,
      Partecipants,
      EventList,
      AddToList,
      deleteEvent,
      deleteAll,
    };
  },
};

</script>

<template>
  <main>
    <!-- Form to add new event -->
    <form @submit.prevent="AddToList">
      <div class="mb-3">
        <label for="Title" class="form-label">Title of Event</label>
        <input type="text" class="form-control" id="Title" v-model="Title" required>
      </div>
      <div class="input-group">
        <span class="input-group-text">Description</span>
        <textarea class="form-control" aria-label="textarea" v-model="Description" required></textarea>
      </div>
      <input type="date" class="form-control" id="Date" v-model="Date" required>
      <div class="mb-3">
        <label for="dayleft" class="form-label">Day left</label>
        <input type="range" class="form-range" min="0" max="5" id="dayleft" v-model.number="Dayleft" required>
      </div>
      <div class="input-group">
        <span class="input-group-text">Event site</span>
        <textarea class="form-control" aria-label="Site" v-model="Site" required></textarea>
      </div>
      <div class="mb-3">
        <label for="partecipants" class="form-label">Participants</label>
        <input type="number" min="1" class="form-control" id="partecipants" v-model.number="Partecipants" required>
      </div>
      <button type="submit" class="btn btn-primary">Submit Event</button>
    </form>

    <!-- Display Event List -->
    <p>Event List:</p>
    <div v-for="(item, index) in EventList" :key="index">
      {{ item.title }} - {{ item.description }}
      <button class="btn btn-primary" @click="deleteEvent(index)">Delete Event</button>
    </div>
    <button class="btn btn-primary" @click="deleteAll">Delete All</button>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 10px;
}
</style>

