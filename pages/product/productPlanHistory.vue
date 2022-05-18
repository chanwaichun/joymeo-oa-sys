<template>
	<view class="productPlanHistory">
		<view class="productPlanHistory-list" v-if="historyList.length > 0">
			<view class="list-item" v-for="(item,index) in historyList" :key="index" @click="toDetailPage(item)">
				<view class="item-header u-flex u-row-between">
					<view class="header-name word-break-all max-width-400">{{item.planName}}</view>
					<view class="header-num">
						总盒数：
						<text class="num-value">{{item.submitNum}}</text>
					</view>
				</view>
				<view class="item-bottom">提交时间：{{item.submitTime}}</view>
			</view>
		</view>
		<EmptyPage emptyText="暂无历史计划" v-else></EmptyPage>
	</view>
</template>

<script>
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	import apiConfig from '@/config/apiConfig.js'
	import tabMixin from '@/mixins/tabMixin.js'
	export default {
		components:{
			EmptyPage
		},
		mixins: [tabMixin],
		data() {
			return {
				historyList: [],
				urlParams: null,
				isCanUpdate: true,
				pageParams: {
					pageNum: 1,
					pageSize: 10
				},
			};
		},
		onReachBottom() {
			this._tabPageReachBottom_on_mixins(() => {
				this.getPlanHistory()
			})
		},
		mounted() {
			this.getPlanHistory()
		},
		methods: {
			getPlanHistory() {
				uni.showLoading({
					title:'数据加载中'
				})
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.getPlanHistory, {
					staffId,
					...this.pageParams
				}).then((res) => {
					uni.hideLoading()
					const {
						data: {
							records
						}
					} = res
					if (res.data.records.length > 0) {
						this.historyList = this.historyList.concat(records)
					} else {
						this.isCanUpdate = false
						this.$util.showToast({
							title: '暂无更多数据',
							icon: 'none'
						})
					}

				})
			},
			toDetailPage(item) {
				const {
					planId,
					submitNum
				} = item
				uni.navigateTo({
					url: `/pages/product/productPlanHistoryDetail?planId=${planId}&submitNum=${submitNum}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.productPlanHistory {
		padding: 20rpx;
		background-color: $common-grey-2;
		min-height: 100vh;

		.productPlanHistory-list {

			.list-item {
				border-radius: 18rpx;
				padding: 34rpx 20rpx;
				background-color: #FFFFFF;
				margin-bottom: 20rpx;

				.item-header {
					margin-bottom: 26rpx;

					.header-name {
						font-size: 36rpx;
						color: $common-color-1;
					}

					.header-num {
						font-size: 24rpx;
						color: $common-grey-1;

						.num-value {
							font-size: 34rpx;
							color: $common-blue-2;
						}
					}
				}

				.item-bottom {
					font-size: 24rpx;
					color: $common-grey-1;
				}
			}
		}
	}
</style>
