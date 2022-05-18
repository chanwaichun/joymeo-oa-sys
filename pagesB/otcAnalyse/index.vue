<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
		<SummaryCard :showTime="true" api="getOtcSalesDataView" :fieldData="[{
				key:'salesNum',
				keyName:'销售量',
				isGrowth:true,
		
			},{
				key:'salesAmount',
				isGrowth:true
		
			},{
				key:'customerNum',
				keyName:'销售门店',
				isGrowth:true,
			
			}]" cardTitle="数据概要" pagetype="OTC"></SummaryCard>
		<u-tabs class="saleRank-tab" bgColor="#FFFFFF" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
			:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<RankCard :showSort="true" :showHeader="true" :showTime="true" :rankHeader="[
					{key:'customerName',keyName:'门店'},
					{key:'classifyName',keyName:'分类',otherKey:'regionName'},
					{key:'salesNum',keyName:'销售量'},
					{key:'salesNumGrowth',keyName:'环比',isGrowth:true}
				]" rankValue='salesRank' api="getOtcCustomerRanking" value="punchClockNum" cardTitle="门店排行榜" v-if="current === 0"
			:fetchByPage="true"></RankCard>
		<RankCard cardTips="区域销售量排行榜" :showSort="true" :showHeader="true" :showTime="true" :rankHeader="[
						{key:'regionName',keyName:'二级分类'},
						{key:'classifyName',keyName:'一级分类'},
						{key:'salesNum',keyName:'销售量'},
						{key:'salesNumGrowth',keyName:'环比',isGrowth:true}
					]" rankValue='salesRank' :titleMargin="0" api="getOtcRegionRanking" value="punchClockNum" cardTitle="二级排行榜"
			v-else-if="current === 1" :fetchByPage="true"></RankCard>
		<RankCard cardTips="分部销售量排行榜" :showSort="true" :titleMargin="0" :showHeader="true" :showTime="true" :rankHeader="[
							{key:'classifyName',keyName:'一级分类'},
							{key:'salesNum',keyName:'销售量'},
							{key:'salesNumGrowth',keyName:'环比',isGrowth:true}
						]" rankValue='salesRank' api="getOtcDeptRanking" value="punchClockNum" cardTitle="一级排行榜" :fetchByPage="true"
			v-else>
		</RankCard>
	</view>
</template>

<script>
	const defaultFilter = {
		OTC: {
			deptId: '',
			dateType: 'yesterday',
			listRegion: [],
			drugId: '',
			classifyId: ''
		}
	}
	import SummaryCard from '@/pagesB/components/common/SummaryCard.vue';
	import RankCard from '@/pagesB/components/common/RankCard.vue';
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from "@/mixins/tabMixin.js";
	export default {
		mixins: [loginMixin, tabMixin],
		components: {
			RankCard,
			SummaryCard,
			DashBoardHeader,
		},
		data() {
			return {
				currentPage: {
					key: "OTCAnalyse",
					type: "OTC",
				},
				tabList: [{
						name: "门店排行榜",
					},
					{
						name: "二级排行榜",
					}, {
						name: "一级排行榜"
					}
				],
				current: 0,
				recordId: null,
				currentFilter: {
					timeKey: "yesterday",
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
		onReachBottom() {
			this._tabPageReachBottom_mixins()
		},
		methods: {
			_loginSuccess_mixin() {
				getApp().globalData.filter = defaultFilter.OTC;
			},
			// 根据当前页面修改过滤条件
			setfilterByCurrentPage() {
				this.currentFilter = {
					timeKey: "yesterday",
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
