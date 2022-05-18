<template>
	<view class="detailCard u-flex" v-if="Object.keys(data).length > 0">

		<TagImageCom :require="data.isRequired" :src="data.productImg" width="120rpx" height="120rpx" />
		<view class="item-info u-flex-col">
			<view class="info-top u-flex u-row-between">
				<view class="top-title">{{data.productName || '-'}}</view>
				<view class="top-num">{{data.boxTotal !== null ? data.boxTotal : '-'}}</view>
			</view>
			<view class="info-bottom u-flex u-row-between">
				<view class="bottom-time">考核时间：{{$util.getCommonTime(data.startDate,'-')}} ~
					{{$util.getCommonTime(data.endDate,'-')}}
				</view>
				<view class="bottom-text">总盒数</view>
			</view>

		</view>
	</view>
</template>

<script>
	import TagImageCom from '../../../components/TagImageCom/TagImageCom.vue'
	export default {
		props: {
			data: {
				type: Object,
				default () {
					return {};
				}
			}
		},

		components: {
			TagImageCom
		},
	}
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.detailCard {
		background-color: #FFFFFF;
		padding: 30rpx 34rpx 20rpx 20rpx;
		border-radius: $common-border-radius;

		.item-info {
			flex: 1;
			padding-left: 10rpx;

			.info-top {
				margin-bottom: 30rpx;
			}

			.bottom-time,
			.bottom-text {
				color: #999999;
			}

			.bottom-time {
				font-size: 20rpx;
			}

			.top-title {
				color: #1A1A1A;
			}

			.bottom-text {
				font-size: 24rpx;
			}

			.top-num {
				font-size: 40rpx;
				color: #1D4393;
				font-weight: bold;
			}

			.top-title {
				font-weight: bold;
				font-size: 30rpx;
			}
		}
	}
</style>
