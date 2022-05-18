<template>
	<view class="dashBoardSelect">
		<view class="dashBoardSelect-select" @click="showSelect">{{currentTitle}}
			<u-icon :style="{marginLeft:'10rpx'}" name="arrow-down" color="#E6E6E6" size="28"></u-icon>
		</view>
		<u-popup v-model="show" duration="0" mode="left">
			<view class="dashBoardSelect-menuList">
				<view class="menuList-item" v-for="(item,index) in menuList" :key="index" @click="itemClick(item)">
					{{item.name}}
				</view>
			</view>
		</u-popup>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				currentTitle: '综合概览',
				show: false,
				menuList: [{
						name: '综合概览',
						key: 'General',
						type: 'BD',
						path:'pagesB/general/index'
					}, {
						name: '打卡排行',
						key: 'ClockRank',
						path:'pagesB/clockRank/index'
					}, {
						name: '考核排行榜',
						key: 'SaleRank',
						path:'pagesB/saleRank/index'
					},
					{
						name: '收入分析',
						key: 'PurchaseAnalyse',
						path:'pagesB/purchaseAnalyse/index'
					},
					{
						name: 'HIS日报',
						key: 'HISDaily',
						path:'pagesB/hisDaily/index'
					}, {
						name: '运营日报',
						key: 'MotionDaily',
						path:'pagesB/motionDaily/index'
					}, {
						name: '诊所排行榜',
						key: 'HotelRank',
						path:'pagesB/hotelRank/index'
					}, {
						name: 'OTC分析',
						key: 'OTCAnalyse',
						path:'pagesB/otcAnalyse/index'
					}
				]
			}
		},
		methods: {
			showSelect() {
				this.show = !this.show
			},
			itemClick(item) {
				const {
					name
				} = item;
				this.currentTitle = name
				this.show = false
				this.$emit('itemClick', item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.popup {
		position: relative;
	}

	.dashBoardSelect {
		.dashBoardSelect-select {
			font-size: 36rpx;
			color: $common-color-3;
		}
	}

	.dashBoardSelect-menuList {
		height: 100vh;
		width: 350rpx;
		padding: 20rpx;

		.menuList-item {
			text-align: center;
			padding: 20rpx;
			border-bottom: 1px solid #E6E6E6;

		}
	}
</style>
