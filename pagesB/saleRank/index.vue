<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
		<SummaryTitle api="getSumSaleRanking"
			:fieldData="[{key:'sumKpiValue'},{key:'sumSalesAmount',keyName:'完成值'},{key:'doneRatio'}]"></SummaryTitle>
		<view class="saleRank-rank">
			<u-tabs class="rank-tab" bgColor="none" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
				:is-scroll="false" :current="current" @change="tabChange">
			</u-tabs>
			<view class="rank-good" v-if="current === 0">
				<RankCard :showSort="true" api="getSaleRanking" :showHeader="true" :showTime="true" :rankHeader="[
						{key:'userName',showRoleName:true,showDeptName:true},
						{key:'kpiValue',showNullBan:true},
						{key:'salesAmount',showDescribe:true,keyName:'完成值'},
						{key:'doneRatio',showUnit:true,keyName:'完成率',showNullBan:true}
					]" rankValue='salesAmountrank' value="salesAmount" cardTitle="考核业绩红榜"></RankCard>
			</view>
			<view class="rank-bad" v-else>
				<RankCard :showSort="false" :showHeader="true" :showTime="false" :rankHeader="[
					{key:'userName',keyName:'姓名',showNullBan:true},
					{key:'deptName',keyName:'部门',showNullBan:true},
					{key:'lastOrderDays',keyName:'最近连续无业绩天数',showNullBan:true}
						]" rankValue='lastOrderRank' api="getBadSaleRanking" cardTitle="考核业绩黑榜">
				</RankCard>
			</view>
		</view>
	</view>
</template>

<script>
	import DashBoardCard from "@/pagesB/components/common/DashBoardCard.vue";
	import SummaryCard from "@/pagesB/components/common/SummaryCard.vue";
	import SummaryTitle from "@/pagesB/components/common/SummaryTitle.vue";
	import RankCard from "@/pagesB/components/common/RankCard.vue";
	// import DashBoardFilter from "@/pagesB/components/header/DashBoardFilter/Index.vue";
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from '@/mixins/tabMixin.js'
	const defaultFilter = {
		BD: {
			dateType: "tmonth",
			deptId: "1"
		},
	};
	export default {
		mixins: [loginMixin,tabMixin],
		components: {
			DashBoardCard,
			SummaryCard,
			SummaryTitle,
			RankCard,
			// DashBoardFilter,
			DashBoardHeader,
		},
		data() {
			return {
				currentPage: {
					key: "ClockRank",
					type: "BD",
				},
				recordId: null,
				currentFilter: {
					timeKey: "tmonth",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				},
				current: 0,
				tabList: [{
						name: "考核业绩红榜",
					},
					{
						name: "考核业绩黑榜"
					}
				]
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
			tabChange(index) {
				this.current = index
			},
		},
	}
</script>

<style>
</style>
