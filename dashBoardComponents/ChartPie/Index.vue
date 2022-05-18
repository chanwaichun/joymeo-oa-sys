<template>
	<!-- 	<qiun-data-charts type="line" :ontouch="true" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}"
		:chartData="chartData" /> -->
	<view class="charts-box">
		<qiun-data-charts v-if="chartData" :canvasId="canvasId" type="pie" :canvas2d="true" :opts="options"
			:animation="false" :chartData="chartData" :onmovetip="true" :ontouch="true" />
		<EmptyPage v-else size="component"></EmptyPage>
	</view>

</template>

<script>
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	export default {
		components: {
			EmptyPage
		},
		props: {
			fieldData: {
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
				}
			},


		},
		data() {
			return {
				options: {
					legend: {
						fontSize: 16,
						position: "bottom",
						float: "left",
						padding: 6,
						margin: 0,
						lineHeight: 16,
						itemGap: 20
					},
					extra: {

						pie: {
							border: false,
							borderWidth: 0,
						},

					}

				},
				fieldBigData,
				chartData: null,
				sortData: null
			}

		},
		mounted() {
			if (this.data.length > 0) {
				this.chartData = {
					series: [{
						data: this.initSeriesData()
					}]
				}
			}
		},
		methods: {
			initSeriesData() {
				if (this.fieldData.length > 0) {
					const nameKey = this.fieldData.find(item => item.type === 'nameKey').key
					const valueKey = this.fieldData.find(item => item.type === 'valueKey').key
					// console.log(this.fieldData)
					const seriesData = this.data.map((fieldDataItem, index) => {
						return {
							name: fieldDataItem[nameKey].length > 15 ? fieldDataItem[nameKey].slice(0, 15) +
								'...' : fieldDataItem[nameKey],
							value: Number(fieldDataItem[valueKey].toFixed(2))
						}
					})

					return this.$util.sortDataByKey(seriesData, 'value', false)
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
		height: 800rpx;

		.box-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
		}
	}
</style>
