<template>
	<view class="dashBoardTabs">
		<u-tabs :showBar="false" :list="menuList" :is-scroll="true" :current="current" @change="change">
		</u-tabs>
	</view>

</template>

<script>
	import {
		allRequestCancel
	} from '@/http/httpCancel.js'
	const menuList = [{
			name: 'HIS日报',
			path: 'pagesB/hisDaily/index'
		},
		{
			name: '收入分析',
			path: 'pagesB/purchaseAnalyse/index'
		}, {
			name: '打卡排行',
			path: 'pagesB/clockRank/index'
		},
		{
			name: '考核排行榜',
			path: 'pagesB/saleRank/index'
		}, {
			name: '运营日报',
			path: 'pagesB/motionDaily/index'
		},
		{
			name: 'OTC分析',
			path: 'pagesB/otcAnalyse/index'
		}

		// , {
		// 	name: '诊所排行榜',

		// 	path: 'pagesB/hotelRank/index'
		// }
	]

	export default {
		data() {
			return {
				current: this.setCurrentByPage(),
				menuList,
			}
		},
		destroyed() {
			console.log(1)
			uni.$off('updateChart');
			uni.$off('rankFilter')
			uni.$off('contentFilter')
		},
		methods: {
			setCurrentByPage() {

				const route = this.$util.getLastPage().route
				
				const current = menuList.findIndex(item => (item.path === route))
				return current
			},
			showSelect() {
				this.show = !this.show
			},
			change(current) {
				allRequestCancel()
				this.current = current;
				uni.reLaunch({
					url: `/${this.menuList[current].path}`
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.dashBoardTabs {
		.dashBoardSelect-select {
			font-size: 36rpx;
			color: $common-color-3;
		}
	}
</style>
