<template>
	<div class="date-picker" :aria-disabled="disabled" :class="[size, {isDisabled: disabled}]" :style="{ width: width }">
		<div class="input-container">
			<div class="input" @click="togglePanel" v-text="value !== '' ? value : placeholder"></div>
		</div>
		<transition name="toggle">
			<div class="date-panel" v-show="panelState" :style="coordinate">
				<div class="panel-header" v-show="panelType !== 'year'">
					<div class="arrow-left" @click="prevMonth()">&lt;</div>
					<div class="year-month-container">
						<div class="year-box" @click="changeType('year')" v-text="secondYear"></div>
						<div class="month-box" @click="changeType('month')">{{secondMonth + 1 | monthName()}}</div>
					</div>
					<div class="arrow-right" @click="nextMonth()">&gt;</div>
				</div>
				<div class="panel-header" v-show="panelType === 'year'">
					<div class="arrow-left" @click="changeYearRange(0)">&lt;</div>
					<div class="year-range">
							<span v-text="yearList[0]"></span> - <span v-text="yearList[yearList.length - 1]"></span>
					</div>
					<div class="arrow-right" @click="changeYearRange(1)">&gt;</div>
				</div>
				<div class="content-type-year" v-show="panelType === 'year'">
					<ul class="year-list">
						<li
							v-for="item in yearList"
							:key="item"
							v-text="item"
							:class="{ selected: isSelected('year', item) }"
							@click="selectYear(item)"></li>
					</ul>
				</div>
				<div class="content-type-month" v-show="panelType === 'month'">
					<ul class="month-list">
						<li
							v-for="(item, index) in monthList"
							:key="item"
							:class="{ selected: isSelected('month', index) }"
							@click="selectMonth(index)">{{item | monthName()}}</li>
					</ul>
				</div>
				<div class="content-type-date" v-show="panelType === 'date'">
					<ul class="weeks-list">
						<li v-for="item in weekList" :key="item">{{ item | weekName() }}</li>
					</ul>
					<ul class="date-list">
						<li
							v-for="(item, index) in dateList"
							:key="index"
							@click="selectDate(item)"
							:class="{ preMonth: item.previousMonth, nextMonth: item.nextMonth, firstItem: (index % 7) === 0 }">
							<div class="date-txt" :class="{ selected: isSelected('date', item) }">
								<div class="bg"></div><span v-text="item.value"></span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: "DatePicker",
	props: {
		value: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: ''
		},
		size: {
			type: String,
			default: 'is-medium'
		},
		width: {
			type: String,
			default: ''
		}
	},
	data() {
		let now = new Date()
		let year, month, date, secondYear, secondMonth, setUpDate

		setUpDate = this.value ? new Date(this.value) : now

		year = setUpDate.getUTCFullYear()
		month = setUpDate.getUTCMonth()
		date = setUpDate.getUTCDate()

		secondYear = setUpDate.getUTCFullYear()
		secondMonth = setUpDate.getUTCMonth()
		return{
			panelState: false,
			coordinate: {},
			panelType: 'date',
			secondYear: secondYear,
			secondMonth: secondMonth,
			yearList: Array.from({length: 12}, (value, index) => new Date().getFullYear() + index),
			monthList: [1, 2, 3 ,4 ,5, 6, 7 ,8, 9, 10, 11, 12],
			weekList: [0, 1, 2, 3, 4, 5, 6],
			rangeStart: false
		}
	},
	mounted(){
		this.$nextTick(() => {
			if(this.$el.parentNode){
				if(this.$el.parentNode.offsetWidth !== null && this.$el.parentNode.offsetLeft !== null && this.$el.offsetLeft !== null){
					if(this.$el.parentNode.offsetWidth + this.$el.parentNode.offsetLeft - this.$el.offsetLeft <= 300){
						this.coordinates = {right: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`}
					}else{
						this.coordinates = {left: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`}
					}
				}
			}

			if(!this.value){
				this.$emit('input', '')
			}
		})
	},
	methods: {
		togglePanel() {
			if(!this.disabled){
				this.panelState = !this.panelState
				this.rangeStart = false
			}
		},
		prevMonth() {
			this.secondMonth = this.secondMonth === 0 ? 0 : this.secondMonth - 1
		},
		nextMonth() {
			this.secondMonth = this.secondMonth === 11 ? 11 : this.secondMonth + 1
		},
		changeType(value) {
			this.panelType = value
		},
		changeYearRange(value) {
			value === 1 ? this.yearList = this.yearList.map((i) => i + 12) : this.yearList = this.yearList.map((i) => i - 12)
		},
		isSelected(type, item) {
			switch (type){
				case 'year' :
					return item === this.secondYear
				case 'month' :
					return item === this.secondMonth && this.year === this.secondYear
				case 'date' :
					return this.date === item.value && this.month === this.secondMonth && item.currentMonth
					let month = this.secondMonth
					item.previousMonth && month--
					item.nextMonth && month++
			}
		},
		selectYear(year) {
			this.secondYear = year
			this.panelType = 'month'
		},
		selectMonth(month) {
			this.secondMonth = month
      this.panelType = 'date'
		},
		selectDate(date) {
			setTimeout(() => {
				if(date.previousMonth){
					if(this.secondYear === 0){
						this.year -= 1
						this.secondYear -= 1
						this.month = this.secondMonth = 11
					}else{
						this.month = this.secondMonth - 1
						this.secondMonth -= 1
					}
				}else if(date.nextMonth){
					if(this.secondMonth === 11){
						this.year += 1
						this.secondYear += 1
						this.month = this.secondMonth = 0
					}else{
						this.month = this.secondMonth + 1
            this.secondMonth += 1
					}
				}

				this.year = this.secondYear
				this.month = this.secondMonth
				this.date = date.value
				let value = `${this.secondYear}-${('0' + (this.month + 1)).slice(-2)}-${('0' + this.date).slice(-2)}`
				this.value = value
				// this.$emit('input', value)
				this.panelState = false
			}, 0)
		}
	},
	computed: {
		dateList() {
			let currentMonthLength = new Date(this.secondYear, this.secondMonth + 1, 0).getDate()
			let dateList = Array.from({ length: currentMonthLength }, (val, index) => {
				return {
					currentMonth: true,
					value: index + 1
				}
			})
			let startDay = new Date(this.secondYear, this.secondMonth, 1).getDay()
			let previousMonthLength = new Date(this.secondYear, this.secondMonth, 0).getDate()

			for(let i = 0, len = startDay; i < len; i++){
				dateList = [{ previousMonth: true, value: previousMonthLength - i }].concat(dateList)
			}
			for(let i = dateList.length, item = 1; i < 42; i++, item++){
				dateList[dateList.length] = { nextMonth: true, value: item }
			}

			return dateList
		}
	},
	filters: {
		weekName: (item) => {
			return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
		},
		monthName: (item) => {
			return {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}[item]
		}
	}
}
</script>

<style lang="scss">
ul{
	padding: 0;
	margin: 0;
	list-style: none;
}
.date-picker{
	position: relative;
	height: 32px;
	&.is-small{
		.input-container{
			height: 25px;
			padding: 5px 10px 6px 4px;
			.input{
				font-size: 12px;
				padding-top: 0;
			}
		}
	}
	&.is-large{
		.input-container{
			height: 50px;
			.input{
				font-size: 18px;
    		padding-top: 8px;
			}
		}
	}
	&.isDisabled{
		.input-container{
			background: #cacaca;
			cursor: not-allowed;
		}
	}
	.input-container{
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		vertical-align: middle;
		display: flex;
		justify-content: space-between;
		flex-flow: row nowrap;
		align-items: center;
		padding: 6px 10px 6px 4px;
		height: 32px;
		box-sizing: border-box;
	}
	.input{
		height: 100%;
		width: 100%;
		font-size: 14px;
    padding-top: 2px;
		padding-left: 9px;
		box-sizing: border-box;
		outline: none;
	}
	.date-panel{
		position: absolute;
		z-index: 5000;
		border: 1px solid #eee;
		box-sizing: border-box;
		width: 320px;
		padding: 5px 10px 10px;
		box-sizing: border-box;
		background-color: #fff;
		transform: translateY(4px);
		.panel-header{
			display: flex;
			flex-flow: row nowrap;
			width: 100%;
			.arrow-left, .arrow-right{
				flex: 1;
				font-size: 20px;
				line-height: 2;
				background-color: #fff;
				text-align: center;
				cursor: pointer;
			}
		}
		.year-month-container{
			flex: 3;
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-around;
			.year-box, .month-box{
				transition: all ease .1s;
				font-family: Arial, sans-serif;
				flex: 1;
				text-align: center;
				font-size: 20px;
				line-height: 2;
				cursor: pointer;
				background-color: #fff;
			}
		}
		.content-type-year, .content-type-month, .date-list{
			background-color: #fff;
		}
		.year-list, .month-list{
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			li{
				font-family: Arial, sans-serif;
				transition: all .4s ease;
				cursor: pointer;
				text-align: center;
				font-size: 20px;
				width: 33%;
				padding: 10px 0;
				&:hover{
					background-color: #6ac1c9;
					color: #fff;
				}
				&.selected{
					background-color: #0097a7;
					color: #fff;
				}
			}
		}
		.content-type-date{
			.weeks-list{
				display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
            font-weight: 600;
        }
			}
			.weeks-list, .date-list{
				width: 100%;
        text-align: center;
        .preMonth, .nextMonth{
          color: #ccc;
        }
        li{
					font-family: Arial;
					width: 30px;
					height: 30px;
					text-align: center;
					line-height: 30px;
        }
			}
			.date-list{
				display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
				.valid:hover{
          background-color: #eee;
        }
				li{
					transition: all .1s ease;
					cursor: pointer;
					box-sizing: border-box;
					border-bottom: 1px solid #fff;
					position: relative;
					margin: 2px;
					&:not(.firstItem){
						margin-left: 10px;
					}
					.date-txt{
						font-family: Arial, sans-serif;
						font-weight: 300;
						font-size: 14px;
						position: relative;
						height: 30px;
						&.selected{
							.bg{
								background-color: rgb(0, 151, 167);
							}
							span{
								color: #fff;
							}
						}
						&:not(.selected){
							.bg{
								transform: scale(0);
								opacity: 0;
							}
							&:hover{
								.bg{
									background-color: rgb(0, 151, 167);
									transform: scale(1);
									opacity: .6;
								}
								span{
									color: #fff;
								}
							}
						}
						.bg{
							height: 30px;
							width: 100%;
							transition: all 450ms ease;
							border-radius: 50%;
							position: absolute;
							z-index: 10;
							top: 0;
							left: 0;
						}
						span{
							position: absolute;
							z-index: 20;
							left: 50%;
							top: 50%;
							transform: translate3d(-50%, -50%, 0);
						}
					}
				}
			}
		}
	}
}
</style>
