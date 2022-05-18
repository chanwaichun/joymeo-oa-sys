<template>
	<!-- 	<qiun-data-charts type="line" :ontouch="true" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}"
		:chartData="chartData" /> -->
	<view class="charts-box">
		<qiun-data-charts v-if="data.length > 0 " :canvasId="canvasId" type="mix" :canvas2d="true" :opts="options"
				  :animation = "false"tooltipFormat="tooltipMix" :chartData="chartData" :onmovetip="true" :ontouch="true" />
		<EmptyPage v-else size="component"></EmptyPage>
	</view>

</template>

<script>
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	export default {
		components:{
			EmptyPage
		},
		props: {
			seriesType: {
				type: Array,
				default: () => {
					return []
				}
			},
			isLoading: {
				type: Boolean,
				default: true
			},
			canvasId: {
				type: String,
				default: ''
			},
			data: {
				type: Array,
				default () {
					return []
					// {
					// 	"categories": ["2016", "2017", "2018", "2019", "2020", "2021"],
					// 	"series": [{
					// 		"name": "成交量A",
					// 		"data": [35, 8, 25, 37, 4, 20]
					// 	}, {
					// 		"name": "成交量B",
					// 		"data": [70, 40, 65, 100, 44, 68]
					// 	}, {
					// 		"name": "成交量C",
					// 		"data": [100, 80, 95, 150, 112, 132]
					// 	}]
					// }
				}
			},
			xAxisName: {
				type: String,
				default: ''
			},
			seriesName: {
				type: Array,
				default: []
			}


		},
		data() {
			return {
				options: {
					enableScroll: false,
					dataLabel: false,
					xAxis: {
						labelCount: 0,
						itemCount: 6,
						scrollShow: true,
						disableGrid: true
					},
					yAxis: {

					},
				},
				fieldBigData,
				chartData: null,
				sortData: null
			}

		},
		mounted() {
			// this.sortData = this.data.sort((a, b) => {
			// 	let x = a.statDate;
			// 	let y = b.statDate;
			// 	return x > y ? 1 : x < y ? -1 : 0;
			// });
			this.chartData = {
				categories: this.initCategoriesData(),
				series: this.initSeriesData()
			}
			// console.log(this.chartData)
		},
		methods: {
			initCategoriesData() {

				const axisData = this.data.map(item =>
					this.$moment(item[this.xAxisName]).format('MM-DD')
				)
				if (axisData.length === 7) {
					this.options.xAxis.labelCount = 4;
				}
				if (this.data.length > 7) {
					this.options.enableScroll = true
					// this.options = {
					// 	...this.options,
					// 	xAxis: {
					// 		labelCount: 1,
					// 		itemCount: 6,
					// 		scrollShow: true,
					// 		disableGrid: true
					// 	},
					// 	extra: {
					// 		column: {

					// 			categoryGap: 1,

					// 		},
					// 	}
					// }
				}
				return Array.from(axisData)
			},
			initSeriesData() {
				let firstItemData = []
				const seriesData = this.data ? this.seriesName.map((key, index) => {
					let itemData = this.data.map(item => this.fieldBigData.format(key, item[key]))
					if (index === 0) {
						firstItemData = itemData
					}

					return {
						key,
						index: index,
						name: this.fieldBigData.getFieldAttribute(key, 'name'),
						data: itemData,
						type: this.seriesType[index]
					}
				}) : [];
				this.options.yAxis = {
					splitNumber: this.$dashBoardUtil.setSplitNumber(firstItemData),
					data: this.seriesName.map((item, index) => {
						let obj = {
							position: index === 0 ? 'left' : 'right',
							title: this.fieldBigData.getFieldAttribute(item, 'name'),
							min: 0
						}
						if (this.fieldBigData.getFieldAttribute(item, 'type') === 'rate') {
							obj = {
								...obj,
								max: 100,
								unit: '%',
								disabled: true
							}
						} else {
							obj = {
								...obj
							}
						}
						return obj
					})
				}
				// [{
				// 	position: 'left',
				// 	title: 'A'
				// }, {
				// 	position: 'right',
				// 	min: 0,
				// 	max:100,
				// 	title: 'B',
				// }]
				return seriesData
			}
		}
	}
</script>

<style lang="scss">
	.charts-box {
		width: 100%;
		height: 600rpx;

		.box-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
		}
	}
</style>
