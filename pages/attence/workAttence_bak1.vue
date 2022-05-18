<template>
	<view class="page-attence">
		<FilterPopup v-model="show">
			<view>筛选</view>
		</FilterPopup>
		<view class="attence-filter fixed-top">
			<view class="filter-item" @click="showFilter()">筛选</view>
		</view>
		<view class="attence-customerList">
			<AttenceList :data="addressList"></AttenceList>
		</view>
	</view>
</template>

<script>
	import loginMixin from '@/mixins/loginMixin.js'
	import api from '@/config/apiConfig.js'
	import AttenceList from "@/pages/attence/workAttence/components/AttenceList/Index.vue"
	import FilterPopup from '@/components/FilterPopup/Index.vue'
	export default {
		components: {
			AttenceList,
			FilterPopup
		},
		mixins: [loginMixin],
		data() {
			return {
				show: false,
				addressList: [],
				latitude: null,
				longitude: null,
				timer: null,
				getAddressOnce: true,
				isLocationUpdate: true

			}
		},
		onShow() {
			// 调用登录钩子

			this._loginHook_mixin()
		},
		methods: {
			// 登录成功后回调mixin的函数
			_loginSuccess_mixin() {
				const systemInfo = wx.getSystemInfoSync();
				// 是否还能够获取地址
				this.getAddressOnce = true;
				// 手机端兼容
				// console.log()
				if (systemInfo.platform !== 'devtools') {
					// 开始定时器 检查定位是否实时刷新
					// this.setTimeoutCancel()
					// 更新位置
					this.updateLocation()
				} else {
					this.setMapLocation()
					const currentPoint = uni.getStorageSync('currentPoint')
					// 判断是否超出500米
					if (currentPoint) {
						const from = {
							lat: currentPoint.latitude,
							lng: currentPoint.longitude
						}
						const to = {
							lat: this.latitude,
							lng: this.longitude
						}
						// const to = `${23.125735077458597},${113.35023119567873}`
						// 如果开始地点不等于结束地点
						if (from !== to) {
							// 百度地图接口判断距离
							const distance = this.$util.getMapDistanceApi(to, from)
							if (distance > 500) {
								this.punchClockOff(currentPoint.cid, true)
							}
						}

					}
				}

			},
			showFilter() {
				this.show = true;
			},
			// 设置地图地址
			updateLocation() {
				wx.startLocationUpdate({
					success: () => {
						console.log('获取定位')
						this.setTimeoutCancel();
						wx.onLocationChange((res) => {
							clearInterval(this.timer);
							console.log(res)

							// 每次更新
							if (res.latitude === 0 && res.longitude === 0 && this.isLocationUpdate) {
								this.isLocationUpdate = false
								wx.stopLocationUpdate()
								wx.offLocationChange()
								this.$util.showToast({
									title: '请开启应用或者小程序的定位服务',
									icon: 'none'
								})
								return;
							}

							const currentPoint = uni.getStorageSync('currentPoint')
							this.latitude = res.latitude;
							this.longitude = res.longitude
							// 判断是否超出500米
							if (currentPoint) {
								const from = {
									lat: currentPoint.latitude,
									lng: currentPoint.longitude
								}
								const to = {
									lat: res.latitude,
									lng: res.longitude
								}
								// const to = `${23.125735077458597},${113.35023119567873}`
								// 如果开始地点不等于结束地点
								if (from !== to) {
									// 百度地图接口判断距离
									const distance = this.$util.getMapDistanceApi(to, from)
									if (distance > 500) {
										this.punchClockOff(currentPoint.cid, true)
									}
								}

							}
							if (this.getAddressOnce) {
								this.getAddressOnce = false;
								this.setMapLocation();
							}

						})

					},
					fail: function() {
						console.log('获取定位失败')
					}
				})

			},
			setMapLocation() {
				const systemInfo = wx.getSystemInfoSync();
				// 如果设备不是开发者工具
				if (systemInfo.platform !== 'devtools') {

					this.getClinicList({
						lng: this.longitude,
						lat: this.latitude
					});
				} else {

					uni.getLocation({
						type: 'gcj02',
						altitude: true,
						success: (res) => {
							this.latitude = res.latitude;
							this.longitude = res.longitude;
							this.getClinicList({
								lng: res.longitude,
								lat: res.latitude
							});
						},
						fail: () => {
							if (this.longitude && this.latitude) {
								this.getClinicList({
									lng: this.longitude,
									lat: this.latitude
								});
							}

							//不允许打开定位
							this.$util.checkAuthorizationInfo()
						}
					})

				}


			},

			getClinicList(location) {
				const {
					staffId: salesmanId

				} = uni.getStorageSync('userInfo')
				const params = {
					radius: 0.5,
					salesmanId,
					...location
				}
				this.$requestData(api.customer.clinicGetList, params).then(({
					data
				}) => {

					this.addressList = data
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss">
	.page-attence {
		position: relative;
		height: 100vh;
		padding-top: 96rpx;

		// padding: 400rpx 30rpx 30rpx 30rpx;
		.attence-filter {
			height: 80rpx;
			background-color: #FFFFFF;
		}
	}
</style>
