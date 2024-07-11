<script setup>
import {ref } from 'vue';
const List = ref([]);
const Title = ref('');
const Desc = ref('');
const tmp = ref('');

const nota = {
	title: Title,
	desc: Desc,
};

const addNota = () =>{
	List.value.push({
		title: Title.value,
		desc: Desc.value,
	});
};

const modifyNota = (index) =>{
	List.value.splice(index,1,{
		title: Title.value,
		desc: tmp.value,
	});
};

const deleteAll = () =>{
	List.value = [];
};

const deleteNote = (index) =>{
	List.value.splice(index,1);
};
</script>

<template>
<main>
	<form @submit.prevent="addNota">
		<div class="input-group">
		  <span class="input-group-text">With textarea</span>
		  <textarea class="form-control" aria-label="With textarea" v-model="Title"></textarea>
		</div>
		<div class="input-group">
		  <span class="input-group-text">With textarea</span>
		  <textarea class="form-control" aria-label="With textarea" v-model="Desc"></textarea>
		</div>
		<button type="submit" class="btn btn-primary">Submit</button>
	</form>
	<p>Note:</p>
	<div v-for="(item, index) in List" :key="index">
		<p> {{item.title}} {{item.desc}}</p>
		<button type="submit" class="btn btn-primary" @click="deleteNote(index)">Delete</button>
		<form @submit.prevent="modifyNota(index)">
			<div class="input-group">
			  <span class="input-group-text">With textarea</span>
			  <textarea class="form-control" aria-label="With textarea" v-model="tmp"></textarea>
			</div>
		<button type="submit" class="btn btn-primary">Submit</button>
	</form>
	</div>
	<button type="submit" class="btn btn-primary" @click="deleteAll">Delete all</button>
</main>
</template>


