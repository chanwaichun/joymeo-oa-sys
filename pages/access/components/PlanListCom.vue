<template>
	<view class="planList" :class="[isSubmit ? 'isSubmit' : '']" v-if="data.length">
		<view class="planList-item u-flex" v-for="(item,index) in data" :key="index">
			<TagImageCom :require="item.isRequired" :src="item.productImg" />
			<view class="item-info">

				<view class="info-text">{{item.productName}}</view>
				<view class="info-num">总数：{{item.boxTotal}}</view>
				<view class="info-currentMonthNum" v-if="isSubmit">
					本月：{{item.monthBoxTotal !== null ? item.monthBoxTotal: '-'}}</view>
				<view class="info-button">
					<u-button v-if="isSubmit" slot="right-button" :custom-style="{
								width: '140rpx',
								height: '64rpx'
							}" size="mini" style="width: 140rpx;height: 56rpx;" :plain="true" type="primary" shape="circle" @click="updatePlanList(item)">
						查看
					</u-button>
					<u-button v-else slot="right-button" :plain="!item.isInput" size="mini" :custom-style="{
								width: '140rpx',
								height: '64rpx'
							}" type="primary" shape="circle" @click="updatePlanList(item)">{{!item.isInput?'修改':'填写'}}
					</u-button>
				</view>
			</view>
		</view>

	</view>
	<page-empty emptyText="当前没有考核上报方案" v-else></page-empty>
</template>

<script>
	import TagImageCom from '../../../components/TagImageCom/TagImageCom.vue'
	export default {
		components: {
			TagImageCom
		},
		props: {
			data: {
				type: Array,
				default: []
			},
			isSubmit: {
				type: Boolean,
				default: true,
			}
		},
		methods: {
			updatePlanList(item) {
				// 更新编辑
				const {
					draftId
				} = item
				this.$emit('setCurrent', 2)
				uni.navigateTo({
					url: `/pages/access/workAccessEdit?isSubmit=${this.isSubmit ? 1 : 0}&draftId=${draftId}`
				})

			}
		}

	}
</script>

<style lang="scss" scoped>
	.planList {
		min-height: 100vh;
		padding: 20rpx 20rpx 140rpx 20rpx;

		&.isSubmit {
			padding: 20rpx;
		}

		.planList-item {
			border-radius: 16rpx;
			padding: 30rpx 20rpx;
			background-color: #FFFFFF;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.item-info {
				padding: 26rpx 20rpx 0rpx 20rpx;
				width: 100%;

				.info-text {
					font-size: 36rpx;
					color: #1A1A1A;
					margin-bottom: 38rpx;
				}

				.info-num,
				.info-currentMonthNum {
					color: #999999;
					font-size: 26rpx;
					margin-bottom: 22rpx;
				}

				.info-button {
					text-align: right;
				}
			}
		}
	}
</style>
