<template>
	<Card class="summaryCard" titleWeight="normal" titleMargin="20" :paddingBottom="true" :card-title="cardTitle">
		<DashBoardTime v-if="!isLoading&&showTime"></DashBoardTime>
		<template v-if="!isLoading">

			<view class="summaryCard-content u-flex u-flex-wrap" v-if="summaryData">
				<template v-for="(item, index) in fieldData">
					<view class="content-ratio" v-if="index % 4 === 0" :key="index">
						<view>{{ item.dayRatioKey ? "日" : "" }}</view>
						<view>{{ item.weekRatioKey ? "周" : "" }}</view>
					</view>
					<view class="content-item" :key="index" :style="{width:pagetype==='OTC'?'33%':''}">
						<view class="item-align item-keyName">
							{{item.keyName || fieldBigData.getFieldAttribute(item.key, "name")}}

						</view>
						<view class="item-align item-key">
							<text v-if="item.isGrowth"
								class="growth-value">{{util.setPriceAbridge(fieldBigData.format(item.key, summaryData[item.key], {isNeedUnit: true,}))}}</text>
							<text
								v-else>{{fieldBigData.format(item.key, summaryData[item.key], {isNeedUnit: true,})}}</text>
							<GrowthCom v-if="item.isGrowth" :iconShow="summaryData[`${item.key}Growth`]!==0"
								:style="{marginLeft:'8rpx',display:'inline-block'}" :propsKey="`${item.key}Growth`"
								:value="summaryData[`${item.key}Growth`]"></GrowthCom>
							<!-- <u-icon v-if="item.isGrowth && summaryData[`${item.key}Growth`]!==0"
								:style="{marginLeft:'4rpx'}"
								:class="['item-key-growthKey',setClassFromValue(summaryData[`${item.key}Growth`])]"
								:name="summaryData[`${item.key}Growth`] > 0?'arrow-up-fill':'arrow-down-fill'"
								size="24">
							</u-icon> -->
							<!-- <text :class="['item-key-growthKey',setClassFromValue(summaryData[`${item.key}Growth`])]"
								v-if="item.isGrowth">

								{{fieldBigData.format(`${item.key}Growth`, summaryData[`${item.key}Growth`], {isNeedUnit: true})}}
							</text>
 -->
						</view>
						<view class="item-align item-dayRatioKey" v-if="item.dayRatioKey"
							:class="[setClassFromValue(summaryData[item.dayRatioKey])]">
							{{fieldBigData.format(item.dayRatioKey,summaryData[item.dayRatioKey],{ isNeedUnit: true })}}
						</view>
						<view class="item-align item-weekRatioKey" v-if="item.weekRatioKey"
							:class="[setClassFromValue(summaryData[item.weekRatioKey])]">
							{{fieldBigData.format(item.weekRatioKey,summaryData[item.weekRatioKey],{ isNeedUnit: true })}}
						</view>
					</view>
				</template>

			</view>
			<EmptyPage size="component" v-else></EmptyPage>
		</template>

		<view class="card-loading" v-else>
			<u-loading class="box-loading" size="90" mode="circle"></u-loading>
		</view>
	</Card>
</template>

<script>
	import Card from '@/components/Card/Card.vue'
	import GrowthCom from '@/components/GrowthCom/GrowthCom.vue'
	import apiConfig from '@/config/apiConfig.js'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	import DashBoardTime from './DashBoardTime.vue'
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	import util from '@/utils/util.js'
	const needFilter = ['getHisPurchaseAmountDataView', 'getOtcSalesDataView'];
	export default {
		name: 'SummaryCard',
		components: {
			DashBoardTime,
			Card,
			EmptyPage,
			GrowthCom
		},
		props: {
			showTime: {
				type: Boolean,
				default: false
			},
			fieldData: {
				type: Array,
				default () {
					return []
				}
			},
			cardTitle: {
				type: String,
				default: '标题'
			},
			api: {
				type: String,
				default: ''
			},
			fliterType: {
				type: String,
				default: 'yesterday'
			},
			pagetype: {
				type: String,
				default: 'normal'
			}
		},
		data() {
			return {
				util,
				isLoading: true,
				fieldBigData,
				summaryData: null,
			}
		},
		destroyed() {
			uni.$off('contentFilter');
		},
		mounted() {

			if (needFilter.includes(this.api)) {
				uni.$on('contentFilter', (filter) => {
					this.getSummaryData(filter)
				});
				this.getSummaryData(getApp().globalData.filter)
			} else {
				this.getSummaryData({})
			}
		},
		methods: {
			setClassFromValue(value) {
				if (value > 0) {
					return 'up'
				} else if (value < 0) {
					return 'down'
				} else {
					return 'invariant'
				}
			},
			getSummaryData(currentFilter) {
				let filter = currentFilter
				this.$emit('setParentComData', {})
				this.isLoading = true
				this.$requestData(apiConfig.dashBoard[this.api], filter).then((res) => {
					this.summaryData = res.data.length > 0 ? res.data[0] : null

					this.isLoading = false
					this.$emit('setParentComData', this.summaryData);



				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/common/common.scss";

	.summaryCard {
		display: flex;
		margin-bottom: 20rpx;

		.card-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 300rpx;
		}

		.summaryCard-content {
			align-items: flex-end;

			.content-ratio {
				margin-bottom: 16rpx;
			}

			.content-item {
				margin-bottom: 16rpx;
				width: 23.5%;

				.item-key-growthKey,
				.item-dayRatioKey,
				.item-weekRatioKey {
					&.up {
						color: #14c4a2;
					}

					&.down {
						color: #ff6b5c;
					}

					&.invariant {
						color: $common-grey-1;
					}
				}

				.item-align {
					text-align: center;
				}

				.item-keyName {
					font-weight: bold;
				}

				.item-keyName,
				.item-key {
					color: $common-color-3;

					.growth-value {
						font-size: 36rpx;
					}
				}
			}

			// .content-left {
			// 	height: 100%;
			// 	display: flex;
			// 	flex-direction: column-reverse;

			// 	margin-right: 10rpx;

			// 	.left-title {
			// 		color: $common-color-3;
			// 	}
			// }

			// .content-main {
			// 	.main-header {
			// 		.header-item {
			// 			text-align: center;
			// 			color: $common-color-3
			// 		}
			// 	}

			// 	.main-data {
			// 		.content-item {
			// 			text-align: center;

			// 			.item-value {
			// 				&.up {
			// 					color: #14c4a2;
			// 				}

			// 				&.down {
			// 					color: #ff6b5c
			// 				}

			// 				&.invariant {
			// 					color: $common-grey-1;
			// 				}
			// 			}
			// 		}

			// 	}
			// }
		}
	}
</style>
