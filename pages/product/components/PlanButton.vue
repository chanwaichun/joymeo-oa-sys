<template>
	<view class="planButton u-flex u-row-between" @click="showModal">
		<view class="part-left u-flex">
			<view class="planButton-box">
				<image class="box-image" :src="boxSrc"></image>
				<view class="box-number" :src="boxSrc">{{Number(totalNum) > 99 ? '99+' : totalNum}}</view>
			</view>
			<view class="planButton-info">
				<view class="info-price">￥<text class="price-detail">{{totalPrice}}</text></view>
				<view v-if="priceDistanceFunc().show" class="info-distance">离发货还差￥{{priceDistanceFunc().priceDistance}}
				</view>
			</view>
		</view>
		<view class="part-right">
			<u-button :disabled="productList.length === 0 || priceDistanceFunc().show" style="width:150rpx;"
				type="primary" shape="circle" @click="submit">提交
			</u-button>
		</view>

	</view>
</template>

<script>
	export default {

		props: {
			productList: {
				type: Array,
				default: []
			},
			targetPrice: {
				type: Number,
				default: 200
			}
		},
		computed: {
			totalPrice() {
				if (this.productList.length > 0) {
					return Number(this.productList.reduce((prev, item) => {
						return prev + (item.productNum * item.productPrice)
					}, 0).toFixed(2))
				} else {
					return 0
				}

			},
			totalNum() {
				if (this.productList.length > 0) {
					return this.productList.reduce((prev, item) => {
						return prev + Number(item.productNum)
					}, 0)
				} else {
					return 0
				}
			}
		},
		data() {
			return {
				boxSrc: `${this.$global.staticAddress}/image/box_report.png`
			}
		},
		methods: {
			priceDistanceFunc() {
				let priceDistance = this.targetPrice - this.totalPrice
				if (priceDistance > 0) {
					return {
						show: true,
						priceDistance: Number(priceDistance.toFixed(2))
					}
				} else {
					return {
						show: false
					}
				}

			},
			showModal() {
				this.$emit('showModal')
			},
			submit() {
				this.$emit('submit')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.planButton {
		width: 100%;
		padding: 15rpx 30rpx;
		background-color: #2E3033;
		border-radius: 50rpx;

		.planButton-box {
			position: relative;
			width: 60rpx;
			height: 60rpx;

			.box-image {
				width: 100%;
				height: 100%;
			}

			.box-number {
				color: #FFFFFF;
				font-size: 20rpx;
				border-radius: 50%;
				position: absolute;
				right: -15rpx;
				top: -10rpx;
				width: 30rpx;
				height: 30rpx;
				text-align: center;
				line-height: 30rpx;
				background-color: $common-red-1
			}
		}

		.planButton-info {
			color: #FFFFFF;
			margin-left: 32rpx;

			.info-price,
			.info-distance {
				font-size: 20rpx;
			}

			.info-price {
				.price-detail {
					font-size: 40rpx;
				}

			}

			.info-distance {}
		}

	}
</style>
