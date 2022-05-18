<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
		<SummaryCard api="getClockDataView" :fieldData="[{
			key:'clockUserNum',
			dayRatioKey:'clockUserGrowthByDay',
			weekRatioKey:'clockUserGrowthByDay'
		},{
			key:'clockRate',
			dayRatioKey:'clockRateGrowthByDay',
			weekRatioKey:'clockRateGrowthByWeek'
		}]" cardTitle="今日数据"></SummaryCard>
		<RankCard :showSort="true" :rankHeader="[
				{key:'userName',showDeptName:true,width:'70%'},
				{key:'punchClockNum',align:'right',showUnit:true,width:'30%'}
			]" rankValue='punchClockNumrank' api="getClockRankingView" value="punchClockNum" cardTitle="打卡排行榜"></RankCard>
	</view>
</template>

<script>
	import DashBoardCard from "@/pagesB/components/common/DashBoardCard.vue";
	import SummaryCard from "@/pagesB/components/common/SummaryCard.vue";
	import RankCard from "@/pagesB/components/common/RankCard.vue";
	// import DashBoardFilter from "@/pagesB/components/header/DashBoardFilter/Index.vue";
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from '@/mixins/tabMixin.js'
	const defaultFilter = {
		BD: {
			dateType: "today",
			deptId: "1"
		},
	};
	export default {
		mixins: [loginMixin,tabMixin],
		components: {
			DashBoardCard,
			SummaryCard,
			RankCard,
			// DashBoardFilter,
			DashBoardHeader,
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
		},
		data() {
			return {
				currentPage: {
					key: "ClockRank",
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
		},
	}
</script>

<style>
</style>
