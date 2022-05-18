<template>
	<view class="planProductList">
		<view class="planProductList-item "
			:class="[(item.hasOwnProperty('show') && item.show) || (!item.hasOwnProperty('show')) ? '' :'hidden']"
			v-for="(item,index) in productList" :key="index">

			<TagImageCom :require="item.required" :src="item.productUrl" width="150rpx" height="150rpx"></TagImageCom>
			<view class="item-info u-flex u-flex-1 u-flex-col u-row-between u-col-top">
				<view class="info-product word-break-all">
				<view class="product-name">{{item.productName}}</view>
				<view class="product-norms">{{item.productNorms}}</view>
				</view>
				<view class="info-operate u-flex u-row-between">
					<view class="operate-price">￥{{item.productPrice}}</view>
					<view class="operate-button">
						<!-- 已提交只显示文字 -->
						<CommonNumberBox :disabled="disabled" :index="index" :value="item.productNum" @change="numberInputChange">
						</CommonNumberBox>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import TagImageCom from '@/components/TagImageCom/TagImageCom.vue'
	import CommonImage from '@/components/CommonImage/CommonImage.vue'
	import CommonNumberBox from '@/components/CommonNumberBox/CommonNumberBox.vue'
	export default {
		components: {
			TagImageCom,
			CommonImage,
			CommonNumberBox
		},
		props: {
			disabled:{
				type: Boolean,
				default: false
			},
			productList: {
				type: Array,
				default: []
			}
		},
		methods: {
			numberInputChange(data) {
				this.$emit('setProductList', data)
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.planProductList {

		.planProductList-item {
			display: flex;
			padding: 50rpx 30rpx 0rpx 40rpx;

			&.hidden {
				display: none;
			}

			.item-info {

				padding: 0 0 0 30rpx;
				.info-product
				{
					.product-name
					{
						margin-bottom: 16rpx;
					}
				}
				.info-operate {
					width: 100%;

					.operate-price {
						color: $common-red-1;
					}

					.operate-button {
						display: flex;

						.button-decrease {
							margin-right: 20rpx;
						}

						.button-input {
							width: 40rpx;
							overflow: hidden;
						}
					}
				}
			}
		}
	}
</style>
