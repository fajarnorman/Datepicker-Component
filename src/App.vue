<template>
	<div class="app">
		<div class="demo-component">
			<h2>Demo Component</h2>
			<div class="field">
				<label>Datepicker</label>
				<datepicker
					v-model="date"
					:disabled="false"
					placeholder="Please input Date"></datepicker>
			</div>
		</div>
	</div>
</template>

<script>
import Datepicker from './components/DatePicker.vue'

export default {
	name: "App",
	data(){
		return{
			date: ''
		}
	},
	components: { Datepicker }
}
</script>

<style lang="scss">
*{
	box-sizing: border-box;
	font-family: 'Roboto', sans-serif;
}
.app{
	padding: 50px;
	@media (max-width: 768px) {
		padding: 20px;
	}
	.demo-component{
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		height: 200px;
		border: 1px solid #ddd;
		text-align: center;
		border-radius: 4px;
		@media (max-width: 768px) {
			position: static;
			transform: none;
			width: 100%;
		}
	}
	.field{
		text-align: left;
		padding: 20px;
		label{
			margin-bottom: 5px;
			margin-right: 5px;
		}
		.date-picker{
			@media (max-width: 768px) {
				width: 100%;
			}
		}
		label, .date-picker{
			display: block;
		}
	}
}
</style>
