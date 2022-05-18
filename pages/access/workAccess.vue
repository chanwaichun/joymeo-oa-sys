<template>
	<view class="page-workAccess">
		<u-tabs class="fixed-top" bgColor="#4975C0" activeColor="#fff" inactiveColor="#FFFFFF" :list="tabList"
			:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view class="workAccess-page">
			<AccessAim v-if="current === 0" key="AccessAim"></AccessAim>
			<AccessRank v-else-if="current === 1" key="AccessRank"></AccessRank>
			<AccessReport @setCurrent="setCurrent" key="AccessReport" v-else-if="current === 2"></AccessReport>
		</view>
	</view>
</template>

<script>
	// dateType
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from "@/mixins/tabMixin.js";
	import CapsuleTab from "@/components/CapsuleTab/CapsuleTab.vue";
	import AccessAim from "./tabComponents/AccessAim.vue";
	import AccessRank from "./tabComponents/AccessRank.vue";
	import AccessReport from "./tabComponents/AccessReport.vue";
	export default {
		mixins: [loginMixin, tabMixin],
		components: {
			// Rank,
			CapsuleTab,
			AccessAim,
			AccessRank,
			AccessReport,
		},
		data() {
			return {
				tabList: [{
						name: "考核目标",
					},
					{
						name: "排行榜",
					},
					{
						name: "考核上报",
					},
				],
				urlParams: {},
				current: "",
			};
		},
		mounted() {
			if (this.urlParams.hasOwnProperty("current")) {
				this.current = Number(this.urlParams.current);
			} else {
				this.current = 0;
			}
		},
		onShow() {
			// 触发跳转钩子
			this.urlParams = this.$util.getUrlParams();
			this._loginHook_mixin();
			this._tabPageShow_mixins()
		},
		onReachBottom() {
			uni.$emit("onReachBottom");
		},
		methods: {
			_loginSuccess_mixin() {
				console.log("已登录");
			},
			// 切换排行榜以及考核
			tabChange(index) {
				this.current = index;
			},
			setCurrent(currenIndex) {
				this.current = currenIndex;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page-workAccess {
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		.workAccess-page {
			flex: 1;
			height: 100%;
			padding-top: 80rpx;
		}
	}
</style>
