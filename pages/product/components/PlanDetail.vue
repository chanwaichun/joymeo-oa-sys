<template>
	<view class="planDetail">
		<view class="planDetail-header u-flex u-row-between ">
			<view class="header-left">
				发货总数：<text class="header-value">{{total || '-'}}</text>
			</view>
			<view v-if="isToDetail" class="header-right" @click="toDetailPage">
				历史计划<image class="link-arrow" :src="arrowSrc"></image>
			</view>

		</view>
		<view class="planDetail-list">
			<view class="list-item u-flex u-col-top" v-for="(item,index) in planDetailList">
				<CommonImage width="150rpx" height="150rpx" :src="item.productUrl"></CommonImage>
				<view class="item-info u-flex u-flex-col u-col-top u-row-between">
					<view class="info-name word-break-all">{{item.productName}}</view>
					<view class="info-num">发货数：<text class="num-value">{{item.productNum}}</text></view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import CommonImage from '@/components/CommonImage/CommonImage.vue';

	export default {
		components: {
			CommonImage
		},
		props: {
			total: {
				type: Number,
				default: 0
			},
			planDetailList: {
				type: Array,
				default: []
			},
			isToDetail: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				arrowSrc: `${this.$global.staticAddress}/image/arrow_report.png`
			}
		},
		methods: {
			toDetailPage() {
	
				this.$emit('toDetailPage');
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.planDetail {
		min-height: 100vh;

		.planDetail-header {
			padding: 30rpx;
			background-color: $common-blue-3;

			.header-left,
			.header-right {
				flex: 1;
			}
			.header-left{
				.header-value{
					color: $common-red-1;
				}
			}
			.header-right {
				text-align: right;
				color: $common-blue-2;

				.link-arrow {
					margin-left: 12rpx;
					width: 20rpx;
					height: 20rpx;
				}


			}
		}

		.planDetail-list {
			.list-item {
				padding: 40rpx 20rpx 40rpx 40rpx;
				border-bottom: 1px solid $common-border-color;

				.item-info {
					margin-left: 30rpx;
					height: 150rpx;
					width: 100%;

					.info-name {
						font-size: 30rpx;
						color: $common-color-1;
					}

					.info-num {
						color: $common-grey-1;
						font-size: 28rpx;
						width: inherit;
						text-align: right;

						.num-value {
							color: $common-color-1;
						}
					}
				}

			}
		}
	}
</style>
