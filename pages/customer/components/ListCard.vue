<template>
	<view class="common-container" v-if="data.length > 0">
		<view class="list-card" v-for="(item,index) in data" :key="index" :arrow="false" :borderBottom="false"
			:borderTop="false" :useLabelSlot="true" @click="cellItemClick(item)" :titleStyle="{width: '100%'}">
			<!-- 非诊所客户 -->
			<template v-if="circulationStatus==='other'">
				<view class="u-flex u-row-between">
					<view class="cell-left">
						<view class="cell-left-name u-m-b-10">{{item.unClinicName || '-'}}</view>
						<view class="font-sm cell-left-tel u-m-b-10">联系方式:{{item.telPhone||'-'}}</view>
					</view>
				</view>
			</template>
			<!-- 诊所客户 -->
			<template v-else>
				<view class="u-flex u-row-between">
					<view class="cell-left">
						<view class="cell-left-name u-m-b-10">{{item.clinicName || '-'}}</view>
						<view class="font-sm cell-left-tel u-m-b-10">联系方式:{{item.telPhone||'-'}}</view>
						<view class="font-sm cell-left-time u-m-b-10">最后跟进:{{item.punchClockFollow||'-'}}</view>
						<view class="font-sm cell-left-person">负责人:{{item.salesmanName||'-'}}</view>
					</view>
					<!-- 合作才展示 -->
					<view class="cell-right-cooperate" v-if="item.circulationStatus === 'coop'">
						合作中
					</view>
					<!-- 不合作不展示 -->
					<view class="cell-right-endTime u-flex-col u-col-center" v-else>

						<view class="endTime-remain u-m-b-12" :class="item.remainingDays<=remainStandard?'danger':''">
							{{item.remainingDays === null ? 0:item.remainingDays}}天
						</view>
						<view class="endTime-text u-m-b-21">截止时间</view>

					</view>
				</view>
				<view class="progress-tips" :class="[item.circulationStatus === 'coop' ? 'visibility-hidden' : '' ]">
					当前进度：<text :style="{color:setProgress(item,'mainColor')}">{{setProgress(item,'name')}}</text>
				</view>
				<ProgressBar type="slip" backgroundColor="#F0F0F0" :startColor="setProgress(item,'startColor')"
					:mainColor="setProgress(item,'mainColor')" :rate="setProgress(item,'percent')"></ProgressBar>

			</template>
		</view>
	</view>
	<page-empty v-else></page-empty>
</template>

<script>
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	export default {
		components: {
			ProgressBar
		},
		props: {
			data: {
				type: Array,
				default () {
					return []
				}
			},
			circulationStatus: {
				type: String,
				default: 'other'
			}
		},
		data() {
			return {
				remainStandard: 2,
				colorConfig: {
					veri: {
						percent: 25,
						mainColor: '#F6A44D',
						startColor: '#FFD7AC',
						name: '验证客户'
					},
					medi: {
						percent: 60,
						mainColor: '#4E7CCC',
						startColor: '#B5D0FF',
						name: '方案报价'
					},
					quot: {
						percent: 60,
						mainColor: '#4E7CCC',
						startColor: '#B5D0FF',
						name: '方案报价'
					},
					cont: {
						percent: 80,
						mainColor: '#49C0A3',
						startColor: '#7DF0D4',
						name: '签订合同'
					},
					coop: {
						percent: 100,
						mainColor: '#D9D9D9',
						startColor: '#D9D9D9',
						name: '开展合作'
					}
				},

			}
		},
		methods: {
			cellItemClick(item) {
				this.$emit('cellItemClick', item)
			},
			setProgress(item, name) {
				const {
					circulationStatus,
					remainingTime,
					remainingDays = 0
				} = item
				if (remainingDays <= this.remainStandard && circulationStatus !== 'coop' && (name === 'mainColor' ||
						name === 'startColor')) {
					if (name === 'mainColor') {
						return '#F6544D'
					} else {
						return '#FFDCC2'
					}
				} else if (circulationStatus) {
					return this.colorConfig[circulationStatus][name]
				} else {
					return this.colorConfig['veri'][name]
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list-card {
		padding: 28rpx 20rpx 24rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;

		&:active {
			background-color: #fdfdfd;
		}

		&:last-child {
			margin-bottom: 0rpx;
		}

		.progress-tips {
			font-size: 20rpx;
			text-align: right;
		}

		.cell-left {
			margin-bottom: 12rpx;

			.cell-left-name {
				max-width: 500rpx;
				word-break: break-all;
				color: #1A1A1A;
				font-size: 32rpx;
			}

			.cell-left-tel,
			.cell-left-time,
			.cell-left-person {
				font-size: 24rpx;
				color: #999999;

			}

			.cell-left-time {}

		}

		.cell-right-cooperate {
			font-size: 36rpx;
			color: #999999;
		}

		.cell-right-endTime {
			.endTime-remain {
				font-size: 36rpx;
				color: #1A1A1A;

				&.danger {
					color: #F52206;
				}
			}

			.endTime-text {
				font-size: 28rpx;
				color: #999999;
			}
		}

	}
</style>
