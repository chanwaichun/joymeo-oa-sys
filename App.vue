<script>
	export default {
		globalData: {
			regionData: [],
			userRegionData: [],
			isGettingData: false,
			filter: null,
			recordId: null,
			filterParams: {
				currentDept: [],
				deptId: null,
				currentTime: [],
				currentRegion: [],
				currentDrug: [],
				currentClassify: []
			}
		},
		onLaunch: function() {
			uni.onNetworkStatusChange((res) => this.networkChangeCallback(res));

		},
		onShow: function() {
			const updateManager = wx.getUpdateManager()
			// wx.hideHomeButton && wx.hideHomeButton();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate)
			})

			updateManager.onUpdateReady(function() {
				wx.showModal({
					title: '更新提示',
					content: '新版本已经准备好，点击重启应用',
					success: function(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})

			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
				wx.showModal({
					title: '更新提示',
					content: '新版本更新失败，请检查网络是否稳定'
				})
			})
		},
		onHide: function() {

			uni.offNetworkStatusChange((res) => this.networkChangeCallback(res))
		},
		onUnload() {

			uni.$off('rankFilter')
			uni.$off('contentFilter')
			this.setLeavePage()

		},
		methods: {
			networkChangeCallback(res) {
				const {
					isConnected,
					networkType
				} = res
				// console.log(networkType)
				if (!isConnected || networkType === '3g' || networkType === '2g') {
					this.$util.showToast({
						icon: "none",
						title: "请检查您的网络设置或重新加载",
					})
				} else {
					uni.hideToast()
				}
			},
			setLeavePage() {
				if (getApp().globalData.recordId) {
					// debugger;
					this.$requestData(apiConfig.setLeavePage, {
						recordId: getApp().globalData.recordId
					}).then(() => {
						getApp().globalData.recordId = null
					})
				}
			},
			// 新加的統一方法 修改筛选条件根据筛选的key
			setCurrentFilterByType(filterKey, key) {
				this.currentFilter[filterKey] = key;
			},
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "@/common/common.scss";
	@import "@/common/dashBoardPage.scss";

	.u-cell-title {
		padding-left: 0px !important;
		padding-right: 0px !important;
		font-size: 36rpx !important;
		font-weight: bold !important;
		color: #000000 !important;
	}

	/*每个页面公共css */
	.common-fixed-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 10;
		background-color: #FFFFFF;
		padding: 20rpx;
	}

	.common-container-top {
		padding-top: 32rpx;


	}

	.common-icon-size {
		width: 40rpx;
		height: 40rpx;
	}

	.common-container-bottom {
		padding-bottom: 120rpx;
	}
</style>
