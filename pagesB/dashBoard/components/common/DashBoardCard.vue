<template>
	<Card titleMargin="20" titleWeight="normal" class="dashBoardCard" :paddingBottom="true" :card-title="cardTitle">
		<view v-if="!isLoading">
			<DashBoardTime></DashBoardTime>

			<view class="dashBoardCard-lastDayData" v-if="data.length > 0">
				<text class="lastDayData-value">
					<template v-if="summaryData.hasOwnProperty(fieldData[0].key)">
						{{setSummaryValue(fieldData[0].key)}}
						<text
							class="value-unit">{{fieldBigData.getFieldAttribute(fieldData[0].key,'unitCN',true)}}</text>
						{{seriesIndex !==  fieldData.filter(item=> item.showSummary).length - 1 && fieldData.filter(item=> item.showLastDay).length !== 0 ? ' | ':''}}
					</template>
				</text>
				<text v-if="fieldData.length > 0" class="lastDayData-value"
					v-for="(seriesItem,seriesIndex) in fieldData.filter(item=> item.showLastDay)" :key="seriesIndex">
					<template>
						{{setLastValue(seriesItem.key)}}
						<text class="value-unit">{{fieldBigData.getFieldAttribute(seriesItem.key,'unitCN',true)}}</text>
						{{seriesIndex !==  fieldData.filter(item=> item.showLastDay).length - 1   ? ' / ':''}}
					</template>
				</text>

				<!-- 		<text v-if="lastDayValue.length > 0" class="lastDayData-value"
					v-for="(seriesItem,seriesIndex) in lastDayValue" :key="seriesIndex">{{setLastValue(seriesItem)}}
					<text class="value-unit">{{fieldBigData.getFieldAttribute(seriesItem,'unitCN',true)}}</text>
					{{seriesIndex !== lastDayValue.length-1  ? '/':''}}
				</text> -->
				<text v-else class="lastDayData-value">{{dataLastValue}}
					<text class="value-unit">{{fieldBigData.getFieldAttribute(seriesName[0],'unitCN')}}</text>
				</text>
				<text v-if="dataLastDate">({{dataLastDate}})</text>
			</view>
			<ChartLine :canvasId="setCanvasId()" v-if="type==='line'" :data="data" :xAxisName="xAxisName"
				:seriesName="seriesName" :fieldData="fieldData">
			</ChartLine>
			<ChartColumn :canvasId="setCanvasId()" v-else-if="type==='bar'" :data="data" :xAxisName="xAxisName"
				:seriesName="seriesName" :fieldData="fieldData">
			</ChartColumn>
			<ChartMix :canvasId="setCanvasId()" v-else-if="type==='mix'" :seriesType="seriesType" :data="data"
				:xAxisName="xAxisName" :seriesName="seriesName" :fieldData="fieldData">
			</ChartMix>
			<ChartArcbar :canvasId="setCanvasId()" :seriesName="seriesName" v-else-if="type==='arcbar'" :data="data"
				:fieldData="fieldData">
			</ChartArcbar>
			<ChartPie :canvasId="setCanvasId()" :seriesName="seriesName" v-else-if="type==='pie'" :data="data"
				:fieldData="fieldData">
			</ChartPie>
		</view>

		<view class="card-loading" v-else>
			<u-loading class="box-loading" size="90" mode="circle"></u-loading>
		</view>

	</Card>
</template>

<script>
	import apiConfig from '@/config/apiConfig.js'
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	import Card from '@/components/Card/Card.vue'
	import ChartLine from '@/dashBoardComponents/ChartLine/Index.vue'
	import ChartColumn from '@/dashBoardComponents/ChartColumn/Index.vue'
	import ChartMix from '@/dashBoardComponents/ChartMix/Index.vue'
	import ChartArcbar from '@/dashBoardComponents/ChartArcbar/Index.vue'
	import ChartPie from '@/dashBoardComponents/ChartPie/Index.vue'
	import util from '@/pagesB/dashBoard/utils/index.js'
	import DashBoardTime from './DashBoardTime.vue'

	export default {
		components: {
			DashBoardTime,
			Card,
			ChartLine,
			ChartColumn,
			ChartMix,
			ChartArcbar,
			ChartPie
		},
		props: {
			summaryData: {
				type: Object,
				default () {
					return {}
				}
			},
			fieldData: {
				type: Array,
				default () {
					return []
				}
			},
			seriesType: {
				type: Array,
				default () {
					return []
				}
			},
			lastDayValue: {
				type: Array,
				default: () => []
			},
			cardTitle: {
				type: String,
				default: '标题'
			},
			api: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'line'
			},
			api: {
				type: String,
				default: ''
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
				data: null,
				isLoading: true,
				filterTime: null,
				dataLastValue: null,
				dataLastDate: null,
				dataLastWeekDate: null,
				fieldBigData
			}
		},
		watch: {
			summaryData(val) {
				// console.log(val)
			}
		},
		destroyed() {
			uni.$off('contentFilter');
		},
		mounted() {
			// 渲染以后订阅onDashBoardShow以及contentFilter的动作
			uni.$on('contentFilter', (filter) => {
				this.getData(filter)
			});
			this.getData(getApp().globalData.filter)

		},
		methods: {
			setLastValue(seriesName) {
				return fieldBigData.format(seriesName, this.data[this.data.length - 1][seriesName])
			},
			setSummaryValue(key) {
				return fieldBigData.format(key, this.summaryData[key])
			},
			setCanvasId() {
				const randomName = `test${parseInt(Math.random() * 10000000)}`
				const time = new Date().getTime()
				return `${this.api||randomName}-${time}`
			},
			getData(filter) {
				this.isLoading = true
				this.$requestData(apiConfig.dashBoard[this.api], filter).then(res => {
					this.filterTime = util.setFilterTime(filter);
					this.data = res.data.length > 1 ? this.$util.sortDataByKey(res.data, 'statDate', true) : res
						.data;

					if (res.data.length > 0 && res.data[0]) {
						// 新版本把lastDayValue以及seriesName集成到fieldData字段中 对以往的组件进行兼容
						if (this.fieldData.length > 0) {
							this.dataLastValue = this.data[this.data.length - 1][this.fieldData[0].key];
						} else {
							this.dataLastValue = this.data[this.data.length - 1][this.seriesName[0]];
						}

						this.dataLastDate = this.data[this.data.length - 1]['statDate'];
					}
					this.isLoading = false

				})

			},

		}

	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.dashBoardCard {
		display: flex;
		margin-bottom: 20rpx;


		.dashBoardCard-time {
			margin-bottom: 32rpx;

			.time-range {
				font-size: 24rpx;
				color: $common-grey-1;
				margin-right: 10rpx;

			}

			.time-key {
				font-size: 24rpx;
				color: #0D0D0D;
				margin-left: 10rpx;

			}
		}

		.dashBoardCard-lastDayData {
			.lastDayData-value {
				font-size: 36rpx;

				.value-unit {
					font-size: 28rpx;
				}
			}
		}

		.card-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 600rpx;
		}
	}
</style>
