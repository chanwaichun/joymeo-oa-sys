<template>
	<view class="page-attence custom-scroll-bar u-flex-col u-col-center">
		<u-modal v-model="tipsModalShow" content="当前门诊存在未完成任务，是否直接退卡" @confirm="tipsConfirm" confirm-text="确定"
			cancel-text="查看任务" @cancel="tipsCancel" :showCancelButton="true" :showConfirmButton="true">
		</u-modal>
		<u-modal v-model="warnModalShow" :content="warnModalContent" @confirm="warnConfirm" :showCancelButton="true"
			:showConfirmButton="true">
		</u-modal>
		<CountDownDialog v-bind:show.sync="punchClockOnShow" content="现在自动将跳转到任务界面" @countFinish="punchClockOnFinish">
		</CountDownDialog>
		<CountDownDialog v-bind:show.sync="punchClockOffShow" :showTitle="false" content="退卡成功">
		</CountDownDialog>
		<map id="myMap" scale="18" style="width: 100%; height: 400rpx;" :latitude="centerLatitude"
			:longitude="centerLongitude" :markers="markers" show-location></map>

		<!-- <view @click="show = true">SADSAD</view> -->
		<view class="u-flex-col"
			:class="addressListLength ? 'page-content u-row-between' : 'empty-page-content u-flex u-col-center' ">
			<template v-if="addressListLength">
				<view class="page-content-select">
					<u-radio-group :value="currentClinic.cid" :wrap="true">
						<u-radio
							:radioColStyle="{alignItems:'baseline',padding:'16rpx 24rpx',borderTop:index!==0?'1px solid #EBEDF0':'none'}"
							:radioItemStyle="{width:'100%',margin:0}" v-for="(item, index) in getUnfinishList"
							:name="item.cid" @change="radioChange(item,index)" :key="index">
							<view class="u-flex u-row-between" :key="index">
								<view class="select-label">
									<view>{{item.clinicName}}</view>
									<view class="select-label-time">
										{{getPunchStatus(item.todayClock)}}
									</view>
								</view>
								<u-button :customStyle="{height:'60rpx',width:'152rpx'}"
									v-if="item.todayClock&&item.todayClock.startTime" class="u-m-r-2" shape="circle"
									size="mini" @click="clickAction('task',item)">查看任务</u-button>
							</view>

						</u-radio>
					</u-radio-group>
					<u-cell-group>
						<u-cell-item :borderTop="true" icon="checkmark-circle-fill" padding="16rpx 24rpx"
							:icon-style='{color:"#00CCA0",marginRight:"-10rpx"}' v-for="(item,index) in getFinishList"
							:arrow="false" :key="index">
							<view slot="title" class="select-label">
								<view>{{item.clinicName}}</view>
								<view class="select-label-time">
									{{getPunchStatus(item.todayClock)}}
								</view>
							</view>
						</u-cell-item>
					</u-cell-group>

				</view>
				<view v-if="isCanPunch && getUnfinishList.length > 0" class="page-content-operate ">
					<view class="operate-button">
						<AttendBtn @buttonClick="clickAction('attence')" :isRegister="isRegister"></AttendBtn>
					</view>
					<view class="operate-tips">
						已进入打卡范围:
						<text :class="[isRegister ? 'register':'unregister']">{{isRegister?'已打卡':'未打卡'}}</text>

					</view>
				</view>
			</template>
			<template v-else>
				<image class="empty-logo" src="https://static.joymeohis.com/wx/gongzonghao/image/empty_clinic.png">
				</image>
				<view class="empty-text-lg u-m-t-44">
					当前无打卡诊所
				</view>
				<view class="empty-text-sm u-m-t-16">
					如果存在诊所,请手动添加
				</view>
				<u-button class="empty-text-sm u-m-t-78" slot="right-button" style="width: 280rpx;" type="primary"
					shape="circle" @click="clickAction('addClinic')">新建诊所
				</u-button>
			</template>


		</view>

	</view>
</template>

<script>
	import AttendBtn from '../../components/AttendBtn/AttendBtn.vue'
	import apiConfig from '../../config/apiConfig.js'
	import loginMixin from '@/mixins/loginMixin.js'
	import CountDownDialog from '../../components/CountDownDialog/CountDownDialog.vue'
	let timer = null
	export default {
		mixins: [loginMixin],
		components: {
			CountDownDialog,
			AttendBtn
		},
		data() {
			return {
				// 控制打卡的弹窗显示
				punchClockOnShow: false,
				// 控制退卡的弹窗显示
				punchClockOffShow: false,
				tipsModalShow: false,
				warnModalShow: false,
				warnModalContent: '',
				timer: null,
				mapCenterLat: null,
				mapCenterLng: null,
				addressList: [],
				centerLatitude: null,
				centerLongitude: null,
				// 当前定位地址
				latitude: null,
				longitude: null,
				punchAddress: null,
				// 坐标
				markers: [],
				// 当前诊所ID用来刷新列表的时候找到当前活跃项
				currentClinicId: null,
				currentClinic: {},
				prevClinic: {},
				isCanPunch: false,
				isRegister: false,
				getAddressOnce: true,
				// 
				isLocationUpdate: true,
			};
		},
		computed: {
			// 获取未完成的打卡列表
			getUnfinishList() {
				// 获取已打卡的诊所 
				let punchList = this.addressList.filter(item => item.todayClock && item.todayClock.startTime && !item
					.todayClock.endTime)
				let unfinishList = this.addressList.filter(item => !item.todayClock)
				if (punchList.length > 0) {
					this.currentClinic = punchList[0]
				} else {
					this.currentClinic = unfinishList[0]
				}

				return [...punchList, ...unfinishList]
			},
			getFinishList() {
				return this.addressList.filter(item => item.todayClock && item.todayClock.startTime && item.todayClock
					.endTime)
			},
			// 实时获取诊所列表长度
			addressListLength() {
				return this.addressList.length
			}
		},
		watch: {
			// 诊所列表更新的时候根据活跃id找到当前活跃信息
			addressList(val) {
				if (this.currentClinicId) {
					let currentClinic = val.find((item) => item.cid === this.currentClinicId)
					this.currentClinic = currentClinic
				}
			},
			currentClinic(val) {
				if (val) {

					this.centerLatitude = val.lat;
					this.centerLongitude = val.lng;
					this.mapCtx && this.mapCtx.moveToLocation({
						latitude: val.lat,
						longitude: val.lng,

					})
					if (Object.keys(val).length > 0) {

						this.isCanPunch = true
					} else {
						this.isCanPunch = false
					}
					if (val.todayClock) {
						this.isRegister = true
					} else {
						this.isRegister = false
					}
				} else {
					this.centerLatitude = this.latitude;
					this.centerLongitude = this.longitude;
					this.isCanPunch = false
				}

			}
		},
		onShow() {
			// 调用登录钩子

			this._loginHook_mixin()
		},
		onHide() {
			wx.offLocationChange && wx.offLocationChange()
			wx.stopLocationUpdate && wx.stopLocationUpdate()
			clearInterval(this.timer);
			clearTimeout(this.timer);
		},
		onReady: function(e) {
			this.mapCtx = uni.createMapContext('myMap')

		},
		methods: {
			// 登录成功后回调mixin的函数
			_loginSuccess_mixin() {
				const systemInfo = wx.getSystemInfoSync();
				//当前活跃诊所置空
				this.currentClinic = {};
				this.currentClinicId = null;
				// 可打卡状态置空
				this.isCanPunch = false
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
			// 2秒后提示开启定位
			setTimeoutCancel() {
				this.timer = setTimeout(() => {
					this.addressList = []
					this.isCanPunch = false;

					this.$util.showToast({
						title: '请开启应用或者小程序的定位服务',
						icon: 'none',
						duration: 5000
					})

				}, 2500)

			},
			// 跳转到诊所任务页面
			navigateToTaskPage(currentItem) {
				const {
					cid,
					clinicName
				} = currentItem
				const paramsStr = this.$util.paramsObjectToString({
					cid,
					clinicName
				})
				uni.navigateTo({
					url: `/pages/attence/workAttenceTask${paramsStr}`
				})
			},
			// 更新地址
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
								this.isCanPunch = false
								return;

							} else {
								this.isCanPunch = true
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
			// 单选选择以后回调
			radioChange(item, index) {
				this.currentClinicId = item.cid
				this.currentClinic = item
			},
			// 设置地图地址
			setMapLocation() {
				const systemInfo = wx.getSystemInfoSync();
				// 如果设备不是开发者工具
				if (systemInfo.platform !== 'devtools') {

					this.getClinicList({
						lng: this.longitude,
						lat: this.latitude
					});
					// 如果缓存里面有打卡信息
					this.getAddressName(this.latitude, this.longitude)
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
							// 如果缓存里面有打卡信息
							this.getAddressName(res.latitude, res.longitude)

						},
						fail: () => {
							if (this.longitude && this.latitude) {
								this.getClinicList({
									lng: this.longitude,
									lat: this.latitude
								});
								// 如果缓存里面有打卡信息
								this.getAddressName(this.latitude, this.longitude)
							}

							//不允许打开定位
							this.$util.checkAuthorizationInfo()
						}
					})

				}


			},

			// 获取单选框内的时间状态
			getPunchStatus(todayClock) {
				if (!todayClock) {
					return '暂未打卡'
				}
				const {
					startTime,
					endTime
				} = todayClock;
				if (startTime && !endTime) {
					return `打卡时间：${startTime}`
				} else {
					return `拜访时间：${startTime}-${this.$moment(endTime).format('hh:mm:ss')}`
				}
			},
			//弹窗点击确定时回调
			punchClockOnFinish() {
				console.log(this.currentClinic);
				this.navigateToTaskPage(this.currentClinic)
			},
			warnConfirm() {
				this.punchClockInsert(true)
			},
			// 提示框确认 执行退卡
			tipsConfirm() {
				const {
					cid
				} = this.currentClinic
				this.punchClockOff(cid)
			},
			// 提示框取消 跳转到任务页面
			tipsCancel() {
				this.navigateToTaskPage(this.currentClinic)
			},
			// 退卡之前
			async beforePunchClockOff(cid) {

				let result = await this.checkIsFinishTask(cid);

				if (result) {
					this.punchClockOff(cid)

				} else {
					this.tipsModalShow = true;
				}
			},
			async checkIsFinishTask(cid) {

				const params = {
					taskTargets: 'CLINIC',
					targetId: cid
				}
				let res = await this.$requestData(apiConfig.getTaskBoardCurrent, params)
				if (res.data.length > 0) {
					return false
				}
				return true

			},
			// 获取当前打卡地址 请求
			getAddressName(latitude, longitude) {
				this.$requestData(apiConfig.baiduMap.getAddressDetail, {
					location: `${latitude},${longitude}`
				}).then(({
					result
				}) => {
					this.punchAddress = result.address
				})
			},

			// 打卡动作 请求
			punchClockInsert(force) {
				if (this.isCanPunch) {

					const {
						deptId,
						staffId: userId,
						trueName: userName

					} = uni.getStorageSync('userInfo')
					// 获取当前诊所名字，id，坐标
					const {
						clinicName,
						cid: clinicId,
						lat: clinicLat,
						lng: clinicLng
					} = this.currentClinic
					let params = {
						startTime: this.$moment().stamp(),
						punchAddress: this.punchAddress,
						onLng: this.longitude,
						onLat: this.latitude,
						clinicId,
						clinicName,
						deptId,
						depName: '测试部门',
						userId,
						userName,
						force
					}
					// 打卡
					this.$requestData(apiConfig.punchClockInsert, params, {
						isNotNeedMsg: true
					}).then((
						res
					) => {
						if (res) {

							// 缓存打卡诊所的信息 用来离开500以后自动打卡
							uni.setStorageSync('currentPoint', {
								latitude: clinicLat,
								longitude: clinicLng,
								cid: clinicId
							})
							this.setMapLocation()
							// this.$util.showToast({
							// 	title: '打卡成功'
							// })
							this.punchClockOnShow = true;
						}
					}).catch((res) => {
						if (res) {
							this.warnModalContent = res;
							this.warnModalShow = true;

						}
					})
				} else {
					this.$util.showToast({
						title: '暂无可打卡诊所',
						duration: 2000,
						icon: 'none'
					})
				}

			},
			// 退卡动作 请求
			async punchClockOff(cid, isOver500) {
				const {
					staffId: userId,
					deptId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.punchClockOff, {
					userId,
					clinicId: cid,

				}).then(({
					data
				}) => {
					if (data) {

						// 退卡时清空当前所有活跃状态
						this.currentClinic = {}
						this.currentClinicId = null;
						uni.setStorageSync('currentPoint', '')
						if (!isOver500) {
							this.punchClockOffContent = "退卡成功"
							this.punchClockOffShow = true;
						}
						this.setMapLocation()
					}
				})
			},
			// 获取诊所列表 请求
			getClinicList(location) {
				const {
					staffId: salesmanId

				} = uni.getStorageSync('userInfo')
				const params = {
					radius: 0.5,
					salesmanId,
					...location
				}
				this.$requestData(apiConfig.clinicGetList, params).then(({
					data
				}) => {

					this.addressList = data
					//设置地图上的坐标
					this.markers = data.map(item => ({
						latitude: item.lat,
						longitude: item.lng,
						width: "100rpx",
						height: "100rpx",
						iconPath: '../../static/icon/location.png'
					}))
					uni.hideLoading()
				})
			},

			// 点击动作
			clickAction(type, currentItem) {
				// 跳转到执行任务
				if (type === 'task') {
					this.navigateToTaskPage(currentItem)
				}
				// dia
				if (type === 'addClinic') {
					uni.navigateTo({
						url: '/pages/customer/customerAdd'
					})
				}
				// 考勤按钮点击
				if (type === 'attence') {
					// 如果未完成打卡退卡的动作则进行
					if (!this.isRegister) {
						this.punchClockInsert(false)
					} else {
						this.beforePunchClockOff(this.currentClinic.cid)
					}

				}

			},

		}
	}
</script>

<style lang="scss">
	.page-attence {
		position: relative;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(242, 244, 247, 1));
		height: 100vh;
		// padding: 400rpx 30rpx 30rpx 30rpx;

		.page-map {
			width: 100%;
			// height: 500rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}



		.page-content,
		.empty-page-content {
			flex: 1;
			width: 100%;
			border-radius: 20rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;


		}

		.empty-page-content {
			padding: 160rpx 160rpx 0rpx 160rpx;

			.empty-logo {
				width: 120rpx;
				height: 120rpx;
			}

			.empty-text-lg {
				font-weight: bold;
				font-size: 32rpx;
				color: #333333;

			}

			.empty-text-sm {
				font-size: 32rpx;
				color: #666666;
			}
		}

		.page-content {
			padding: 0rpx 20rpx 74rpx 20rpx;


			.page-content-select {
				height: 310rpx;
				overflow-y: scroll;

				.select-label {
					margin-left: 20rpx;

					.select-label-time {
						color: #999999;
						font-size: 22rpx;
					}
				}
			}

			.page-content-operate {
				.operate-button {
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.operate-tips {
					margin-top: 56rpx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28rpx;

					.register {
						color: #008A6C;
					}

					.unregister {
						color: #1D4393;
					}
				}

			}
		}
	}
</style>
