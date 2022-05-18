<template>
	<view class="page-customerList">
		<view class="page-header">
			<u-tabs :list="tabList" inactiveColor="#999999" :current="current" @change="tabChange">
			</u-tabs>
		</view>


		<ListCard :data="customerList" @cellItemClick="cellItemClick" :circulationStatus="params.circulationStatus">
		</ListCard>

		<fixed-btn>
			<u-button slot="right-button" style="width: 100%;" type="primary" shape="circle" @click="addCustomer">
				{{params.circulationStatus === 'other' ? '新增客户' : '新增门诊'}}
			</u-button>
		</fixed-btn>
	</view>
</template>

<script>
	import ListCard from './components/ListCard.vue'
	import apiConfig from '../../config/apiConfig.js';
	import loginMixin from '../../mixins/loginMixin.js'
	import util from '../../utils/util.js'
	export default {
		mixins: [loginMixin],
		components: {
			ListCard
		},
		data() {
			return {
				isLoading: false,
				tabList: [{
					name: '全部',
					value: ""
				}, {
					name: "验证客户",
					value: 'veri'

				}, {
					name: "方案报价",
					value: 'quot'
				}, {
					name: "签订合同",
					value: 'cont'
				}, {
					name: '开展合作',
					value: 'coop'
				}, {
					name: '非诊所客户',
					value: 'other'
				}],
				params: {
					pageNum: 1,
					pageSize: 20,
					circulationStatus: ''
				},
				current: 0,
				isCanUpdate: true,
				customerList: []
			};
		},
		onShow() {

			this.resetPage();
			// 触发跳转钩子

			this._loginHook_mixin()
		},
		onReachBottom() {
			if (this.isCanUpdate && !this.isLoading) {
				this.params.pageNum += 1;
				this.getCustomerList()
			}
		},
		methods: {
			// 已登录后的回调
			_loginSuccess_mixin() {
				// 获取客户列表
				if (this.params.circulationStatus === 'other') {
					this.getUnclinicList()
				} else {
					this.getCustomerList()
				}

			},
			getUnclinicList() {
				uni.showLoading({
					title: '数据加载中'
				})
				this.$requestData(apiConfig.getUnclinicList, {
					pageNum: this.params.pageNum,
					pageSize: this.params.pageSize
				}).then((res) => {
					this.isLoading = false

					uni.hideLoading();
					this.customerList = this.customerList.concat(res.data.records)
					if (res.data.records.length === 0) {
						this.isCanUpdate = false
						this.$util.showToast({
							title: "暂无更多数据",
							icon: 'none'
						})
					}


				}).catch(() => {
					this.isLoading = false
				})
			},
			// 获取客户列表
			getCustomerList(params) {
				const {
					staffId: salesmanId
				} = uni.getStorageSync('userInfo')
				const currentParams = {
					...this.params,
					...params,
					salesmanId
				}
				uni.showLoading({
					title: '数据加载中'
				})
				this.isLoading = true
				this.$requestData(apiConfig.customerGetList, currentParams).then((res) => {
					this.isLoading = false
					if (res) {
						uni.hideLoading();
						this.customerList = this.customerList.concat(res.data.records)
						if (res.data.records.length === 0) {
							this.isCanUpdate = false
							this.$util.showToast({
								title: "暂无更多数据",
								icon: 'none'
							})
						}

					}

				}).catch(() => {
					this.isLoading = false
				})
			},
			addCustomer() {
				uni.navigateTo({
					url: `/pages/customer/customerAdd?type=${this.params.circulationStatus}`
				})
			},
			cellItemClick(item) {

				if (this.params.circulationStatus !== 'other') {
					const {
						cid,
						circulationStatus,
						remainingTime,
						remainingDays,
						punchClockFollow
					} = item
					let params = {
						remainingDays,
						cid,
						circulationStatus,
						remainingTime,
						punchClockFollow
					}
					uni.navigateTo({
						url: `/pages/customer/customerDetail${util.paramsObjectToString(params)}`
					})
				} else {
					const {
						id
					} = item
					let params = {
						id
					}
					uni.navigateTo({
						url: `/pages/customer/unclinicDetail${util.paramsObjectToString(params)}`
					})
				}

			},
			tabChange(index) {
				if (!this.isLoading) {
					this.params.circulationStatus = this.tabList[index].value
					this.current = index;
					// 每次切换tab重新设置页数
					this.resetPage()
					// 如果是非诊所客户
					if (index !== this.tabList.length - 1) {
						this.getCustomerList()
					} else {
						this.getUnclinicList()
					}

				}

			},
			// 重新设置参数
			resetPage() {
				this.params.pageNum = 1;
				this.params.pageSize = 20;
				this.customerList = [];
				this.isCanUpdate = true;
			},

		}
	}
</script>

<style lang="scss">
	.page-customerList {
		position: relative;
		background-color: #F7F7F7;
		padding: 110rpx 20rpx 180rpx 20rpx;
		min-height: 100vh;
	}

	.page-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	}

	.page-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		text-align: center;
		background-color: #FFFFFF;
		padding: 32rpx 0;
	}
</style>
