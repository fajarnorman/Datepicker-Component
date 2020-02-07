<template>
	<div class="app">
		<div class="demo-component">
			<h2>Demo Component</h2>
			<div class="field">
				<label>Datepicker</label>
				<datepicker
					v-model="date"
					width="20%"
					:disabled="false"
					placeholder="Please input Datepicker"></datepicker>
			</div>
		</div>
		<div class="documentations">
			<table>

			</table>
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
}
.app{
	padding: 50px;
	.field{
		label{
			margin-bottom: 5px;
			margin-right: 5px;
		}
		label, .date-picker{
			display: inline-block;
			vertical-align: middle;
		}
	}
}
</style>
