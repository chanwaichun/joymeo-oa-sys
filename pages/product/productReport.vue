<!-- 货款报备主页面 -->
<template>

	<view class="productReport">
		<u-tabs class="fixed-top" bgColor="#FFFFFF" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
			:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view class="productReport-page">
			<ReportIndex v-if="current === 0"></ReportIndex>
			<ReportPlan v-else></ReportPlan>
		</view>

	</view>
</template>

<script>
	import loadingMixin from '../../mixins/loadingMixin.js'
	import tabMixin from '../../mixins/tabMixin.js'
	import loginMixin from '../../mixins/loginMixin.js'
	import ReportIndex from '@/pages/product/tabComponents/ReportIndex.vue'
	import ReportPlan from '@/pages/product/tabComponents/ReportPlan.vue'


	export default {
		components: {
			ReportIndex,
			ReportPlan
		},
		mixins: [loadingMixin, loginMixin, tabMixin],
		data() {
			return {
				tabList: [{
						name: "货款报备",
					},
					{ 
						name: "发货计划",
					}
				],
				current: 0,
				urlParams: null,
			}
		},
		onPullDownRefresh() {
			this.getProductList('search')
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
			// if (this.isCanUpdate) {
			// 	this.params.pageNum += 1;
			// 	this.getProductList();
			// }
		},
		onShow() {
			this._loginHook_mixin()
			this._tabPageShow_mixins()
		},
		onHide() {
			this._tabPageHide_mixins()
		},
		methods: {
			// 成功登陆后回调
			_loginSuccess_mixin() {
				this.urlParams = this.$util.getUrlParams()
				// this.getProductList('search')
			},
			tabChange(index) {
				this.current = index;
			},

		}
	}
</script>

<style lang="scss" scoped>
	.productReport {
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		.productReport-page {
			padding-top: 80rpx;
		}
	}

	.value-title {
		color: #333333;

		.value-text {
			color: #1A1A1A;
			font-size: 34rpx;

		}
	}
</style>
