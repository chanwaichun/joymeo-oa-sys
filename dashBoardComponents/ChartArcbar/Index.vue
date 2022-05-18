<template>
	<!-- 	<qiun-data-charts type="line" :ontouch="true" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}"
		:chartData="chartData" /> -->
	<view class="charts-box">
		<qiun-data-charts v-if="chartData" 
			  :animation = "false"
		:canvasId="canvasId" type="arcbar" :canvas2d="true" :opts="options"
			:chartData="chartData" />
		<page-empty v-else emptyType="smallCard"></page-empty>
	</view>

</template>

<script>
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	export default {
		props: {
			canvasId: {
				type: String,
				default: ''
			},
			data: {
				type: Array,
				default () {
					return []
				}
			},
			seriesName: {
				type: Array,
				default: []
			}

		},
		data() {
			return {
				fieldBigData,
				arcbarColor: "#4975C0",
				chartData: null,
				options: null
			}

		},
		mounted() {

			if (this.data.length > 0) {
				this.chartData = {
					series: this.initSeriesData()
				}
			} else {
				this.chartData = null
			}

		},
		methods: {

			initSeriesData() {
				if (this.seriesName.length > 0) {
					const seriesKey = this.seriesName[0];
					const seriesValue = this.data[0][seriesKey]
					const seriesData = [{
						key: seriesKey,
						name: fieldBigData.getFieldAttribute(seriesKey, 'name'),
						data: seriesValue > 1 ? 1 : seriesValue,
						color: this.arcbarColor
					}]
					this.options = {
						title: {
							name: `${fieldBigData.format(seriesKey, seriesValue)}%`,
							color: '#4975C0',
							fontSize: 35
						},
						subtitle: {
							name: fieldBigData.getFieldAttribute(seriesKey, 'name'),
							color: '#4975C0',
							fontSize: 35
						}
					}
					return seriesData
				} else {
					return []
				}

			}
		}
	}
</script>

<style lang="scss">
	.charts-box {
		width: 100%;
		height: 600rpx;

		.miniCard {
			height: 500rpx;
		}

		.box-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
		}
	}
</style>
