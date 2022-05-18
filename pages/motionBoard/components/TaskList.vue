<template>
	<!-- 任务看板的任务列表 -->
	<view class="taskList">
		<EmptyPage v-if="taskList.length ===0 " emptyText="暂无任务"></EmptyPage>
		<view class="taskList-item u-flex u-row-between" v-else v-for="(item,index) in taskList" :key="index"
			@click="itemClick(item)">
			<image class="item-icon" :src="setImageByTab()"></image>
			<view class="item-info">
				<view class="info-task u-flex">
					<view class="task-title">{{item.title}}</view>
					<view class="task-num" v-if="current===0 && item.frequency > 0">
						{{item.frequency}}
					</view>
				</view>
				<view class="info-time" v-if="item.finishTime">完成时间：{{$util.getCommonTimeCn(item.finishTime)}}</view>
			</view>
			<!-- 	<view class="item-name max-width-200 word-break-all u-flex">
				{{userName}}
			</view> -->
		</view>

	</view>
</template>

<script>
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	export default {
		components: {
			EmptyPage
		},
		props: {
			taskList: {
				type: Array,
				default: []
			},
			current: {
				type: Number,
				default: 0,

			}

		},
		data() {
			return {
				userName: uni.getStorageSync('userInfo').nickName,
				headersSrc: uni.getStorageSync("userInfo").avatar ? uni.getStorageSync("userInfo").avatar :
					`${this.$global.staticAddress}/image/header_default.png`,
			}
		},
		methods: {
			itemClick(item) {
				this.$emit('itemClick', item)
			},
			setImageByTab() {
				const staticAddress = this.$global.staticAddress
				if (this.current === 0) {
					return `${staticAddress}/image/unfinished_task.png`
				}
				return `${staticAddress}/image/finished_task.png`
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.taskList {

		min-height: 40vh;
		width: 100%;
		position: relative;
		padding: 0rpx 20rpx;

		.taskList-item {
			// border-radius: 16rpx;
			background-color: #FFFFFF;
			position: relative;
			padding: 36rpx 20rpx 40rpx 80rpx;
			border-bottom: 1px solid $common-grey-3;

			&:last-child {
				border-bottom: 0px;
			}

			.item-icon {
				position: absolute;
				top: 40rpx;
				left: 20rpx;
				width: 44rpx;
				height: 50rpx;
			}

			.item-info {
				width: 100%;

				.info-task {
					color: $common-color-1;
					font-size: 36rpx;

					// margin-bottom: 26rpx;
					.task-title {
						width: 100%;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.task-num {
						margin-left: 10rpx;
						color: #FFFFFF;
						line-height: 40rpx;
						text-align: center;
						width: 40rpx;
						height: 40rpx;
						background-color: #4975C0;
						border-radius: 50%;
						font-size: 26rpx;
					}
				}

				.info-time {
					margin-top: 16rpx;
					color: $common-grey-1;
					font-size: 24rpx;
				}
			}

			.item-name {
				color: $common-color-1;

				.name-icon {
					margin-right: 8rpx;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

	}
</style>
