<template>
	<view class="saleAnalyse">
		<SummaryCard :showTime="true" api="getHisPurchaseAmountDataView" :fieldData="[{
				key:'grossMerchandiseVolume',

			},{
				key:'purchaseAmount',
	
			},{
				key:'purchaseOrderNum',

			},{
				key:'purchaseClinicNum',
			},{
				key:'purchaseProductNum',
			},{
				key:'purchaseAmountPerClinic',
			},{
				key:'purchaseRate',
			}]" cardTitle="数据概要" @setParentComData="setParentComData"></SummaryCard>
		<!-- GMV看板 -->
		<DashBoardCard type="bar" api="getHisPurchaseAmountGMV"
			:fieldData="[{key:'grossMerchandiseVolume',showLastDay:true,showSummary:true}]" xAxisName="statDate"
			cardTitle="应收金额" :summaryData="summaryData" />
		<!-- 采购金额 -->
		<DashBoardCard type="bar" api="getHisPurchaseAmount" xAxisName="statDate"
			:fieldData="[{key:'purchaseAmount',showLastDay:true,showSummary:true}]" cardTitle="实收金额"
			:summaryData="summaryData" />
		<!-- 订单数 -->
		<DashBoardCard type="bar" api="getHisPurchaseOrderNum" xAxisName="statDate"
			:fieldData="[{key:'purchaseOrderNum',showLastDay:true,showSummary:true}]" cardTitle="有效订单数"
			:summaryData="summaryData" v-if="pageParams.pageNum > 1"/>
		<!-- 客单价 -->
		<DashBoardCard type="bar" api="getHisPurchaseAmountPerClinic" xAxisName="statDate"
			:fieldData="[{key:'purchaseAmountPerClinic',showLastDay:true,showSummary:true}]" cardTitle="客单价"
			:summaryData="summaryData"v-if="pageParams.pageNum > 1" />
		<!-- 下单诊所数 -->
		<DashBoardCard type="bar" api="getHisPurchaseClinicNum" xAxisName="statDate"
			:fieldData="[{key:'purchaseClinicNum',showLastDay:true,showSummary:true}]" cardTitle="下单诊所数"
			:summaryData="summaryData" v-if="pageParams.pageNum > 2"/>
		<!-- 下单转化率 -->
		<DashBoardCard type="line" api="getHisPurchaseRate" xAxisName="statDate"
			:fieldData="[{key:'purchaseRate',showLastDay:true,showSummary:true}]" cardTitle="下单转化率"
			:summaryData="summaryData" v-if="pageParams.pageNum > 2"/>
		<DashBoardCard v-if="pageParams.pageNum > 3" type="pie" api="getHisPurchaseProductNum" :fieldData="[{
				key:'purchaseProductNum',	
				showSummary:true,
				type:'valueKey'
			},{
				key:'productSpuName',
				type:'nameKey'
			}]" cardTitle="商品数" :summaryData="summaryData" />
		<view class="saleAnalyse-rank" v-if="pageParams.pageNum > 3">
			<u-tabs class="rank-tab" bgColor="none" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
				:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
			<view class="rank-outpatient" v-if="current === 0">
				<RankCard :showSort="true" :showHeader="true" :rankHeader="[
					{key:'cityName',keyName:'城市',showNullBan:true},
					{key:'provinceName',keyName:'省份',showNullBan:true},
					{key:'purchaseAmount',keyName:'实收金额'}
						]" rankValue='purchaseAmountRanking' api="getHisCityPurchaseAmountRanking" cardTitle="城市实收排行榜">
				</RankCard>
			</view>
			<view class="rank-recipeSheet" v-else>
				<RankCard :showSort="true" :showHeader="true" :rankHeader="[
					{key:'clinicName',keyName:'诊所',showNullBan:true},
					{key:'cityName',keyName:'城市',showNullBan:true},
					{key:'salesmanName',keyName:'城市经理',showNullBan:true},
					
					{key:'purchaseAmount',keyName:'实收金额'}
						]" rankValue='purchaseAmountRanking' api="getHisClinicPurchaseAmountRanking" cardTitle="诊所实收排行榜">
				</RankCard>
			</view>
		</view>
		<!-- 	<RankCard api="getSaleRanking" :showHeader="true" :rankHeader="[
				{key:'userName',showRoleName:true,showDeptName:true},
				{key:'kpiValue',showNullBan:true},
				{key:'salesAmount'},
				{key:'doneRatio',showUnit:true,showNullBan:true}
			]" rankValue='salesAmountrank' value="salesAmount" cardTitle="采购排行榜"></RankCard> -->
	</view>
</template>

<script>
	import tabMixin from '@/mixins/tabMixin.js'
	import SummaryCard from '../components/common/SummaryCard.vue'
	import RankCard from "../components/common/RankCard.vue"
	import DashBoardCard from '../components/common/DashBoardCard.vue'
	export default {
		mixins:[tabMixin],
		components: {
			RankCard,
			SummaryCard,
			DashBoardCard
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
				summaryData: {}
			}
		},
		destroyed() {
			this._tabComReachBottom_off_mixins()
		},
		mounted() {
			this._tabComReachBottom_on_mixins(() => {
		
				if (this.pageParams.pageNum > 3) {
					this.isCanUpdate = false
				}
			})
		},
		methods: {
			tabChange(index) {
				this.current = index
			},
			setParentComData(data) {
				this.summaryData = data ? data : {}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.saleAnalyse-rank {
		margin-top: 16rpx;
		background-color: #FFFFFF;
	}
</style>
