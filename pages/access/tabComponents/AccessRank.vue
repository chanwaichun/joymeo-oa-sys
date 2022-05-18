<template>
	<view>
		<view key="rank" class="workAccess-select">
			<uni-data-checkbox v-model="activeSelect" :disabled="buttonDisabled" :localdata="selectType" mode="tag"
				@change="selectChange">
			</uni-data-checkbox>
		</view>
		<view class="workAccess-currentRank">
			<view class="currentRank-item">
				<view class="currentRank-item-rank">你当前的排名：第<text
						:style="{color:'#4975C0'}">{{getRankByType(rankInfo)}}</text>名</view>
				<view class="currentRank-item-detail">业绩：<text
						:style="{color:'#666666'}">{{getTargetByType(rankInfo)}}</text> </view>

			</view>
			<view class="currentRank-item">
				<CapsuleTab :disabled="buttonDisabled" :tabList="capsuleList" @capsuleClick="capsuleClick"></CapsuleTab>
			</view>

		</view>

		<Rank :activeSelect="activeSelect" :rankList="rankList"></Rank>
	</view>
</template>

<script>
	import Rank from '@/components/Rank/Rank.vue'
	import CapsuleTab from '@/components/CapsuleTab/CapsuleTab.vue'
	import apiConfig from '@/config/apiConfig.js'
	import fieldMap from '@/fieldMap/fieldNormal.js'
	import tabMixin from "@/mixins/tabMixin.js";
	export default {
		mixins: [tabMixin],
		components: {
			Rank,
			CapsuleTab
		},
		mounted() {
			uni.$on('onReachBottom', (data) => {
				if (this.isCanUpdate) {
					this.params.pageNum += 1;
					this.getRankListByType(this.activeSelect)
				}
			});
			this.getRankListByType(this.activeSelect)
			// this._tabComShow_on_mixins(() => {
			// 	this.getRankListByType(this.activeSelect)
			// })
		},
		destroyed() {
			uni.$off('onReachBottom');
		},
		data() {
			return {
				isCanUpdate: false,
				fieldMap,
				capsuleList: [{
					value: 'tweek',
					text: '本周'
				}, {
					value: 'tmonth',
					text: '本月'
				}],
				tabList: [{
					name: "考核目标",
				}, {
					name: '排行榜'
				}],
				selectType: [{
						value: 'MEMBER_NUM',
						text: '客户量'
					},
					{
						value: 'SALES_MONEY',
						text: '销售额'
					}
				],

				activeSelect: 'MEMBER_NUM',
				params: {
					pageNum: 1,
					pageSize: 20,
					dateType: 'tweek'
				},
				buttonDisabled: true,
				rankList: [],
				rankInfo: {}
			};
		},
		methods: {

			getRankListByType(type) {
				uni.showLoading({
					title: "排行榜加载中"
				})
				if (type === 'MEMBER_NUM') {
					this.getSalesCountRank()
				} else {
					this.getPaymentReportingRank()
				}
			},
			getRankByType(rankInfo) {
				const {
					expClinicNumRank = '', salesAmountrank = ''
				} = rankInfo
				if (this.activeSelect === 'MEMBER_NUM') {
					return expClinicNumRank !== '' ? expClinicNumRank : '-'
				} else {
					return salesAmountrank !== '' ? salesAmountrank : '-'
				}
			},
			// 获取目标值通过指标类型
			getTargetByType(rankInfo) {
				const {
					expClinicNum = '', salesAmount = ''
				} = rankInfo
				const unit = fieldMap.getFieldAttribute(this.activeSelect, 'unit', true)
				if (this.activeSelect === 'MEMBER_NUM') {
					return expClinicNum !== '' ? `${unit}${expClinicNum}` : '-'
				} else {
					return salesAmount !== '' ? `${unit}${salesAmount}` : '-'
				}
			},
			// 药丸切换
			capsuleClick(currentObj) {
				const {
					value
				} = currentObj
				this.rankList = [];
				this.rankInfo = {}
				this.params.pageNum = 1;
				this.buttonDisabled = true;
				this.params.dateType = value
				this.rankList = [];
				this.rankInfo = {}
				this.getRankListByType(this.activeSelect)
			},
			selectChange(data) {

				const {
					detail: {
						value
					}
				} = data
				this.buttonDisabled = true;
				this.params.pageNum = 1;
				this.rankList = [];
				this.rankInfo = {}
				this.getRankListByType(value)
			},
			// 获取销售额的排行榜
			getPaymentReportingRank() {
				const {
					staffId: userId
				} = uni.getStorageSync('userInfo')
				Promise.all([this.$requestData(apiConfig.getUserSaleRanking, {
					userId,
					dateType: this.params.dateType
				}), this.$requestData(apiConfig.getAllSaleRanking, {
					dateType: this.params.dateType,
					...this.params
				})]).then((res) => {
					uni.hideLoading()
					const [{
						data: rankInfo
					}, {
						data: {
							records: rankList
						}
					}] = res;

					this.buttonDisabled = false;
					this.rankInfo = rankInfo;
					if (rankList.length) {
						this.isCanUpdate = true
						this.rankList = this.rankList.concat(rankList)
					} else {
						this.isCanUpdate = false
						uni.showToast({
							icon: 'none',
							title: '暂无更多数据',
							duration: 2000
						})
					}
				}).catch(() => {
					this.buttonDisabled = false;
				})
			},

			// 获取客户量的排行榜
			getSalesCountRank() {
				const {
					staffId: userId
				} = uni.getStorageSync('userInfo')
				Promise.all([this.$requestData(apiConfig.getUserClientRanking, {
					userId,
					dateType: this.params.dateType
				}), this.$requestData(apiConfig.getClientRanking, {
					dateType: this.params.dateType,
					...this.params
				})]).then((res) => {
					uni.hideLoading()
					const [{
						data: rankInfo
					}, {
						data: {
							records: rankList
						}
					}] = res;

					this.buttonDisabled = false;
					this.rankInfo = rankInfo
					if (rankList.length) {
						this.isCanUpdate = true
						this.rankList = this.rankList.concat(rankList)
					} else {
						this.isCanUpdate = false
						uni.showToast({
							icon: 'none',
							title: '暂无更多数据',
							duration: 2000
						})
					}

				}).catch(() => {
					this.buttonDisabled = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.workAccess-select {
		padding: 10rpx 20rpx;
	}

	.workAccess-currentRank {
		height: 100rpx;
		padding: 20rpx 20rpx 0 20rpx;
		display: flex;
		justify-content: space-between;

		.currentRank-item-rank {

			font-size: 32rpx;
			font-weight: bold;
		}
	}


	.page-container {
		padding: 32rpx;

		.module-part {
			padding: 20rpx;

			.part-title {
				display: flex;
				justify-content: space-between;
			}
		}
	}
</style>
