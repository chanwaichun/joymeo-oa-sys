<template>
	<view class="accessReport-bottom fixed-bottom u-flex u-row-between">
		<text class="bottom-info">总盒数:<text class="info-value">{{boxTotal || '0'}}</text>
		</text>
		<u-button slot="right-button" style="width: 300rpx;" type="primary" shape="circle" @click="submit">提交
		</u-button>
	</view>
</template>

<script>
	export default {
		props: {
			boxTotal: {
				type: Number,
				default: 0
			}
		},
		methods: {
			submit() {
				this.$emit('submit')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.accessReport-bottom {
		padding: 10rpx 30rpx 30rpx;
		background-color: #FFFFFF;

		.bottom-info {
			font-size: 28rpx;
			color: #999999;
			.info-value {
				margin-left: 10rpx;
				font-size: 38rpx;
				font-weight: bold;
				color: #1D4393;
			}
		}

	}
</style>
