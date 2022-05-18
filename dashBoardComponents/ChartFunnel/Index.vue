<template>
	<!-- 	<qiun-data-charts type="line" :ontouch="true" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}"
  :chartData="chartData" />-->
	<view class="charts-box">
		<qiun-data-charts :canvasId="canvasId" type="funnel" :canvas2d="true" :opts="{extra:{funnel:{type:'triangle'}}}"
				  :animation = "false"
			:chartData="chartData" :onmovetip="true" :ontouch="true"/>
	</view>
</template>
<script>
	import fieldBigData from "@/fieldMap/fieldBigData.js";
	export default {
		props: {
			isLoading: {
				type: Boolean,
				default: true,
			},
			canvasId: {
				type: String,
				default: "",
			},
			fieldData: {
				type: Array,
				default () {
					return [];
				},
			},
			data: {
				type: Array,
				default () {
					return [];
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
				},
			},
			xAxisName: {
				type: String,
				default: "",
			},
			seriesName: {
				type: Array,
				default: [],
			},
		},
		data() {
			return {
				chartData: {
					"series": [{
						"data": [{
							"name": "一班",
							"value": 50
						}, {
							"name": "二班",
							"value": 30
						}, {
							"name": "三班",
							"value": 20
						}, {
							"name": "四班",
							"value": 18
						}, {
							"name": "五班",
							"value": 8
						}]
					}]
				},
				sortData: null,
			};
		},

		mounted() {
			// this.sortData = this.data.sort((a, b) => {
			// 	let x = a.statDate;
			// 	let y = b.statDate;
			// 	return x > y ? 1 : x < y ? -1 : 0;
			// });
			this.chartData = {
				"series": [{
					"data": [{
						"name": "一班",
						"value": 50
					}, {
						"name": "二班",
						"value": 30
					}, {
						"name": "三班",
						"value": 20
					}, {
						"name": "四班",
						"value": 18
					}, {
						"name": "五班",
						"value": 8
					}]
				}]
			}
			// debugger;
			// this.chartData = {
			// 	categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
			// 	series: [{
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
		},
		methods: {
			initCategoriesData() {
				const axisData = this.data.map((item) =>
					this.$moment(item[this.xAxisName]).format("MM-DD")
				);
				if (axisData.length === 7) {
					this.options.xAxis.labelCount = 4;
				}
				if (axisData.length > 7) {
					this.options = {
						...this.options,
						enableScroll: true,
					};
				}
				return Array.from(axisData);
			},
			initSeriesData() {
				if (this.seriesName.length > 0) {
					const seriesData = this.data ?
						this.seriesName.map((key, index) => {
							let itemData = this.data.map((item) =>
								fieldBigData.format(key, item[key])
							);
							this.options.yAxis.splitNumber = this.$dashBoardUtil.setSplitNumber(
								itemData
							);
							return {
								key,
								name: fieldBigData.getFieldAttribute(key, "name"),
								data: itemData,
							};
						}) : [];
					return seriesData;
				} else {
					const seriesData = this.data ?
						this.fieldData.map((fieldItem, index) => {
							let itemData = this.data.map((dataItem) =>
								fieldBigData.format(fieldItem.key, dataItem[fieldItem.key])
							);
							// this.options.yAxis.splitNumber = this.$dashBoardUtil.setSplitNumber(itemData)
							return {
								key: fieldItem.key,
								name: fieldBigData.getFieldAttribute(fieldItem.key, "name"),
								data: itemData,
							};
						}) : [];
					this.options.yAxis = this.$dashBoardUtil.setYAxisOptions(
						this.fieldData,
						seriesData
					);
					return seriesData;
				}
				// const seriesData = this.data ? this.seriesName.map((key, index) => {
				// 	let itemData = this.data.map(item => fieldBigData.format(key, item[key]))
				// 	this.options.yAxis.splitNumber = this.$dashBoardUtil.setSplitNumber(itemData)
				// 	return {
				// 		key,
				// 		name: fieldBigData.getFieldAttribute(key, 'name', true) || key,
				// 		data: itemData
				// 	}
				// }) : []
				// return seriesData
			},
		},
	};
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
