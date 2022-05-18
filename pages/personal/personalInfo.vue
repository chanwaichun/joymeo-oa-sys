<template>
	<view class="personalInfo common-container-bottom">
		<view class="personalInfo-header u-flex u-flex-col u-row-between">
			<image class="header-icon" :src="headersSrc"></image>
			<view class="header-text">{{userInfo.nickName || '-'}}</view>
			<view class="header-deptName">{{userInfo.deptName || '-'}}</view>
		</view>

		<view class="personalInfo-container">
			<view class="container-app">
				<view class="app-item" v-for="(item,index) in menuList" @click="toPage(item)"
					:class="[index < 6 ?'item-border-bottom':'',index + 1 % 3 !== 0 ? 'item-border-right' : '']"
					:key="index">
					<image class="item-image" :src="setAppImage(item)"></image>
					<view class="item-text">{{item.text}}</view>
				</view>
			</view>
		</view>
		<fixed-btn>
			<u-button slot="right-button" style="width: 100%;" type="primary" shape="circle" @click="loginOut">重新登录
			</u-button>
		</fixed-btn>
	</view>

</template>

<script>
	import loginMixin from '@/mixins/loginMixin.js'
	import apiConfig from '@/config/apiConfig.js'
	export default {
		mixins: [loginMixin],
		data() {
			return {
				userInfo: uni.getStorageSync("userInfo"),
				headersSrc: uni.getStorageSync("userInfo").avatar ? uni.getStorageSync("userInfo").avatar :
					`${this.$global.staticAddress}/image/header_default.png`,
				menuList: [{
						pagePath: "/pagesB/dashBoard/index",
						text: "数据助手",
						name: 'dataDashBoard'
					},
					// {
					// 	pagePath: "/pagesB/dashBoard/dataDashBoard",
					// 	text: "数据助手",
					// 	name: 'dataDashBoard'
					// },
					{
						pagePath: "/pages/attence/workAttence",
						text: "到店打卡",
						name: 'workAttence'
					},
					{
						pagePath: "/pages/access/workAccess",
						text: "考核",
						name: 'workAccess'
					},
					{
						pagePath: "/pages/customer/customerList",
						text: "客户列表",
						name: 'customerList'
					},
					{
						pagePath: "/pages/product/productReport",
						text: "货款报备",
						name: 'productReport'
					},
					{
						pagePath: "/pages/motionBoard/dataMotionBoard",
						text: "政策看板",
						name: 'dataMotionBoard'
					},
					{
						pagePath: "/pages/motionBoard/taskMotionBoard",
						text: "任务看板",
						name: 'taskMotionBoard'
					},
					{
						pagePath: "/pages/feedback/issueFeedback",
						text: "问题反馈",
						name: 'issueFeedback'
					}
				]
			}
		},
		onShow() {
			this.setLeavePage();
		},
		methods: {
			// 跳转到对应的页面
			toPage(item) {
				const {
					pagePath
				} = item
				uni.navigateTo({
					url: pagePath
				})
			},
			setAppImage(item) {
				const pathArray = item.pagePath.split('/');
				const iconName = pathArray[pathArray.length - 1]
				return `${this.$global.staticAddress}/image/app_${item.name}.png`
			},
			loginOut() {
				uni.clearStorageSync()
				this.$util.reLaunchToLoginPage()
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
		}


	}
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.personalInfo {

		max-height: 100vh;
		min-height: 100vh;
		background-color: $common-grey-2;

		.personalInfo-header {
			padding: 20rpx 0rpx 40rpx;
			background-color: #4975C0;
			text-align: center;

			.header-icon {
				width: 130rpx;
				height: 130rpx;
				margin-bottom: 10rpx;
			}

			.header-text {

				font-size: 40rpx;
				color: #FFFFFF;
			}

			.header-deptName {
				font-size: 36rpx;
				color: #FFFFFF;
			}

		}

		.personalInfo-container {
			padding: 20rpx 20rpx 0rpx 20rpx;

			.container-app {
				border-radius: 16rpx;
				background-color: #FFFFFF;
				display: flex;
				flex-wrap: wrap;

				.app-item {
					padding: 50rpx;
					width: 33.33%;
					text-align: center;

					&.item-border-bottom {
						border-bottom: 1px solid $common-grey-2;
					}

					&.item-border-right {
						border-right: 1px solid $common-grey-2;
					}

					.item-image {
						width: 80rpx;
						height: 80rpx;
					}

					.item-text {
						margin-top: 14rpx;
					}
				}
			}


		}
	}
</style>
