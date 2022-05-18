<template>
	<view class="productList" v-if="data.length > 0">
		<view class="productList-content u-flex u-flex-wrap">
			<view class="content-item" v-for="(item,index) in data" :key="index">
				<view class="item-box">
					<view class="box-title word-nowrap">{{item.productName}}</view>
					<view class="box-value">
						<text class="value-done">{{item.doneBoxNum}}</text>
						<text class="value-target">/{{item.reportBoxNum}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default () {
					return []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.productList {
		padding-top: 44rpx;
		margin-left: -16rpx;
		margin-right: -16rpx;

		.productList-content {
			.content-item {
				width: 33%;
				padding: 16rpx 10rpx;

				color: $common-color-2;

				.item-box {
					// height: 89rpx;
					padding: 16rpx;
					border-radius: 8rpx;
					box-shadow: 0 0 20rpx #CCCCCC;

					.box-title {
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: 24rpx;
						color: $common-color-1;
						padding-bottom: 10rpx;
						border-bottom: 1px solid $common-border-color;

					}

					.box-value {
						.value-done {
							color: $common-blue-1;
							font-size: 30rpx;
						}
						.value-target {
							color: $common-grey-1;
							font-size: 20rpx;
						}
					}
				}


			}
		}
	}
</style>
