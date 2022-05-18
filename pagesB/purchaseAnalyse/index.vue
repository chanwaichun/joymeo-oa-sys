<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
		<SummaryCard :showRatioName="false" :filter="pageFilter" :showLastDayValue="false" :showTime="true"
			api="getIncomeAmountData" :fieldData="[{
			key:'grossMerchandiseVolume',
			dayRatioKey:'grossMerchandiseVolumeGrowth',
			keyName:'应收金额',
		},
		{
			key:'purchaseAmount',
			keyName:'实收金额',
			dayRatioKey:'purchaseAmountGrowth'
		},
		{
			key:'purchaseOrderNum',
			dayRatioKey:'purchaseOrderNumGrowth',
			keyName:'订单数',
		},{
			key:'purchaseAmountPerClinic',
			dayRatioKey:'purchaseAmountPerClinicGrowth',
		},{
			key:'purchaseClinicNum',
		
			dayRatioKey:'purchaseClinicNumGrowth',
		},{
			key:'purchaseRate',

			dayRatioKey:'purchaseRateGrowth'
		},{
			key:'purchaseProductNum',
			keyName:'销售量',
			dayRatioKey:'purchaseProductNumGrowth',
		},{
			key:'productNumOrderNumRate',
			dayRatioKey:'productNumOrderNumRateGrowth',
		}]" cardTitle="数据概览" @setParentComData="setParentComData"></SummaryCard>
		<!-- GMV看板 -->
		<DashBoardCard :showLastDayValue="false" type="bar" api="getIncomePurchaseAmountGMV"
			:fieldData="[{key:'grossMerchandiseVolume',showLastDay:true,showSummary:true}]" xAxisName="statDate"
			cardTitle="应收金额" :summaryData="summaryData">
			<TotalValue slot="totalValue" :totalData="summaryData" totalField="grossMerchandiseVolume"
				:dayNum="summaryData.periodDates"></TotalValue>
		</DashBoardCard>
		<!-- 商品应收金额占比 -->
		<DashBoardCard type="pie" api="getIncomePurchaseProductAmount" :fieldData="[{
			key:'purchaseProductAmount',
			showSummary:true,
			type:'valueKey'
		},{
			key:'productSpuName',
			type:'nameKey'
		}]" cardTitle="商品应收金额占比" />
		<!-- 实收金额 -->
		<DashBoardCard :showLastDayValue="false" type="bar" api="getIncomePurchaseAmount" xAxisName="statDate"
			:fieldData="[{key:'purchaseAmount'}]" cardTitle="实收金额" :summaryData="summaryData">
			<TotalValue slot="totalValue" :totalData="summaryData" totalField="purchaseAmount"
				:dayNum="summaryData.periodDates"></TotalValue>
		</DashBoardCard>
		<!-- 订单数 -->
		<DashBoardCard :showLastDayValue="false" type="bar" api="getIncomePurchaseOrderList" xAxisName="statDate"
			:fieldData="[{key:'purchaseOrderNum'}]" cardTitle="订单数" :summaryData="summaryData"
			v-if="pageParams.pageNum > 1">
			<TotalValue slot="totalValue" :totalData="summaryData" totalField="purchaseOrderNum"
				:dayNum="summaryData.periodDates"></TotalValue>
		</DashBoardCard>
		<!-- 客单价 -->
		<DashBoardCard :showLastDayValue="false" type="bar" api="getIncomePurchaseAmountPerClinicList"
			xAxisName="statDate" :fieldData="[{key:'purchaseAmountPerClinic',showLastDay:true,showSummary:true}]"
			cardTitle="客单价" :summaryData="summaryData" v-if="pageParams.pageNum > 1">
			<NumberTag slot="totalValue" label="客单价" field="purchaseAmountPerClinic"
				:data="summaryData.purchaseAmountPerClinic/summaryData.periodDates">
			</NumberTag>
		</DashBoardCard>
		<!-- 下单诊所数 -->
		<DashBoardCard otherNumberTag="totalClinicNum" :dayNum="summaryData.periodDates" :showLastDayValue="false"
			type="bar" api="getIncomePurchaseClinicNumList" xAxisName="statDate"
			:fieldData="[{key:'purchaseClinicNum',showLastDay:true,showSummary:true}]" cardTitle="下单诊所数"
			:summaryData="summaryData" v-if="pageParams.pageNum > 2">
		</DashBoardCard>
		<!-- 下单转化率 -->
		<DashBoardCard type="line" :showLastDayValue="false" api="getIncomePurchaseRateList" xAxisName="statDate"
			:fieldData="[{key:'purchaseRate',showLastDay:true,showSummary:true}]" cardTitle="下单转化率"
			:summaryData="summaryData" v-if="pageParams.pageNum > 2">
			<NumberTag slot="totalValue" label="总" field="purchaseRate" :data="summaryData.purchaseRate">
			</NumberTag>
		</DashBoardCard>

		<view class="saleAnalyse-rank" v-if="pageParams.pageNum > 3">
			<u-tabs class="rank-tab" bgColor="none" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
				:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
			<view class="rank-outpatient" v-if="current === 0">
				<RankCard :showSort="true" :showHeader="true" :rankHeader="[
					{key:'cityName',keyName:'城市',showNullBan:true},
					{key:'provinceName',keyName:'省份',showNullBan:true},
					{key:'purchaseAmount',keyName:'实收金额'},
					{key:'grossMerchandiseVolume',keyName:'应收金额'}
						]" rankValue='purchaseAmountRanking' api="getIncomeCityPurchaseAmountRanking" cardTitle="城市实收排行榜"
					:fetchByPage="true">
				</RankCard>
			</view>
			<view class="rank-recipeSheet" v-else>
				<RankCard :showSort="true" :showHeader="true" :rankHeader="[
					{key:'clinicName',keyName:'诊所',showNullBan:true},
					{key:'cityName',keyName:'城市',showNullBan:true},
					{key:'salesmanName',keyName:'负责人',showNullBan:true},
					{key:'purchaseAmount',keyName:'实收金额'},
					{key:'grossMerchandiseVolume',keyName:'应收金额'}
						]" rankValue='purchaseAmountRanking' api="getIncomeClinicPurchaseAmountRanking" cardTitle="诊所实收排行榜"
					:fetchByPage="true">
				</RankCard>
			</view>
		</view>
	</view>
</template>

<script>
	import loginMixin from "@/mixins/loginMixin.js";
	import DashBoardCard from "@/pagesB/components/common/DashBoardCard.vue";
	import SummaryCard from "@/pagesB/components/common/SummaryCard.vue";
	import RankCard from "@/pagesB/components/common/RankCard.vue";
	import tabMixin from '@/mixins/tabMixin.js'
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import NumberTag from '@/pagesB/components/common/NumberTag.vue'
	import TotalValue from '@/pagesB/components/common/TotalValue.vue'
	const defaultFilter = {

		listRegion: [],
		dateType: 'tmonth'

	};
	export default {
		mixins: [loginMixin, tabMixin],
		components: {
			DashBoardHeader,
			RankCard,
			SummaryCard,
			DashBoardCard,
			TotalValue,
			NumberTag
		},
		onShow() {
			this._loginHook_mixin();
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
			if (this.isCanUpdate) {
				this.pageParams.pageNum += 1;
				if (this.pageParams.pageNum > 3) {
					this.isCanUpdate = false
				}
			}
		},
		data() {
			return {
				isCanUpdate: true,
				pageParams: {
					pageNum: 1
				},
				current: 0,
				tabList: [{
						name: "城市实收排行榜",
					},
					{
						name: "诊所实收排行榜",
					}
				],
				summaryData: {},
				currentPage: {
					key: "PurchaseAnalyse",
					type: "HIS",
				},
				recordId: null,
				currentFilter: {
					timeKey: "tmonth",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				},
			}
		},
		methods: {
			_loginSuccess_mixin() {
				getApp().globalData.filter = defaultFilter;
			},
			tabChange(index) {
				this.current = index
			},
			setParentComData(data) {
				this.summaryData = data ? data : {}
			},
			setfilterByCurrentPage() {
				this.currentFilter = {
					timeKey: "tmonth",
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
		}
	}
</script>

<style lang="scss">

</style>
