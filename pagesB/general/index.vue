<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
		<SummaryCard api="getYesterday" :fieldData="[{
			key:'logUserNum',
			dayRatioKey:'logUserGrowthByDay',
			weekRatioKey:'logUserGrowthByWeek'
		},{
			key:'expClinicNumSum',
			keyName:'诊所新增',
			dayRatioKey:'expClinicGrowthByDay',
			weekRatioKey:'expClinicGrowthByWeek'
		},{
			key:'clockUserNum',
			dayRatioKey:'clockUserGrowthByDay',
			weekRatioKey:'clockUserGrowthByWeek'
		},{
			key:'salesAmountSum',
			keyName:'货款报备',
			dayRatioKey:'salesAmountGrowthByDay',
			weekRatioKey:'salesAmountGrowthByWeek'
		}]" cardTitle="昨日数据"></SummaryCard>
		<DashBoardCard api="getSignStatistic" xAxisName="statDate" :fieldData="[{key:'logUserNum',showLastDay:true}]"
			cardTitle="登录人数"></DashBoardCard>
		<DashBoardCard api="getNewClinicStatistic" xAxisName="statDate"
			:fieldData="[{key:'expClinicNumSum',showLastDay:true}]" cardTitle="新增诊所数"></DashBoardCard>
		<DashBoardCard api="getClockNumStatistic" xAxisName="statDate"
			:fieldData="[{key:'clockUserNum',showLastDay:true}]" cardTitle="打卡人数"></DashBoardCard>
		<DashBoardCard api="getPaymentStatistic" xAxisName="statDate"
			:fieldData="[{key:'salesAmountSum',showLastDay:true}]" cardTitle="货款报备金额"></DashBoardCard>
		<!-- <u-button @click="goPlugins">sadsasa</u-button> -->
	</view>
</template>

<script>
	import DashBoardCard from "@/pagesB/components/common/DashBoardCard.vue";
	import SummaryCard from "@/pagesB/components/common/SummaryCard.vue";
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from "@/mixins/tabMixin.js";
	const defaultFilter = {
		BD: {
			deptId: "1",
			dateType: "n7days",
		},
	};
	export default {
		mixins: [loginMixin,tabMixin],
		components: {
			DashBoardCard,
			SummaryCard,
			// DashBoardFilter,
			DashBoardHeader,
		},
		data() {
			return {
				currentPage: {
					key: "General",
					type: "BD",
				},
				recordId: null,
				currentFilter: {
					timeKey: "today",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				},
			};
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
		},
		onShow() {
			this._loginHook_mixin();
		},
		methods: {
			_loginSuccess_mixin() {
				getApp().globalData.filter = defaultFilter.BD;
			},
			// 根据当前页面修改过滤条件
			setfilterByCurrentPage() {
				this.currentFilter = {
					timeKey: "today",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				};
			},

			resetFilter() {
				this.setfilterByCurrentPage();
			},
			setCurrentFilterByType(filterKey, key) {
				this.currentFilter[filterKey] = key;
			},
			// goPlugins() {
			// 	let plugin = requirePlugin('routePlan');
			// 	let key = 'SJFBZ-3I6C5-B7MIE-QWQ5V-APXRS-3FBAM'; //使用在腾讯位置服务申请的key
			// 	let referer = '卓悦地推'; //调用插件的app的名称
			// 	let endPoint = JSON.stringify({ //终点
			// 		name: '吉野家(北京西站北口店)',
			// 		latitude: 39.89631551,
			// 		longitude: 116.323459711,
			// 	});
			// 	wx.navigateTo({
			// 		url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +
			// 			'&navigation=1'+"&themeColor=#4975C0"
			// 	});
			// }
		},
	};
</script>

<style lang="scss">
</style>
