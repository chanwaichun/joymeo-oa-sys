<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :currentPage="currentPage" @resetFilter="resetFilter"
			@setCurrentFilterByType="setCurrentFilterByType" @setPageFilter="setPageFilter">
		</DashBoardHeader>
		<SummaryCard :filter="pageFilter" :showLastDayValue="false" :showTime="true" api="getHisDataSummary" :fieldData="[{
			key:'logClinicNum',
			dayRatioKey:'clinicNumGrowthByDay'
		},
		{
			key:'cooperateClinicNum',
			keyName:'HIS签约数',
			dayRatioKey:'cooperateClinicNumGrowthByDay'
		},
		{
			key:'visitNum',
			keyName:'接诊单数',
			dayRatioKey:'visitNumGrowthByDay',
		},{
			key:'recipeNum',
			keyName:'处方单数',
			dayRatioKey:'recipeNumGrowthByDay',
		},{
			key:'activeClinicNum',
			keyName:'活跃诊所数',
			dayRatioKey:'activeClinicNumGrowthByDay',
		},{
			key:'patientNum',
			keyName:'接诊人数',
			dayRatioKey:'patientNumGrowthByDay'
		},{
			key:'warehouseSkuNum',
			dayRatioKey:'warehouseSkuNumGrowthByDay',
		}]" cardTitle="数据概览" @setParentComData="setTotalData"></SummaryCard>
		<DashBoardCard :filter="pageFilter" :showLastDayValue="false" type="bar" api="getHisLogClinicNum"
			xAxisName="statDate" :fieldData="[{key:'logClinicNum'}]"
			:pageToDetail="{url:'/pagesB/hisDaily/hisRegister/index',title:'HIS注册数明细',currentPage,currentFilter,pageFilter}"
			cardTitle="HIS注册数">
			<TotalValue v-if="totalData" slot="totalValue" :totalData="totalData" totalField="logClinicNum"
				:dayNum="totalData.periodDates"></TotalValue>
		</DashBoardCard>
		<DashBoardCard :filter="pageFilter" :showLastDayValue="false" type="bar" api="getHisCooperateClinicNum"
			:pageToDetail="{url:'/pagesB/hisDaily/hisSign/index',title:'HIS签约数明细',currentPage,currentFilter,pageFilter}"
			xAxisName="statDate" :fieldData="[{key:'cooperateClinicNum'}]" cardTitle="HIS签约数">
			<TotalValue v-if="totalData" slot="totalValue" :totalData="totalData" totalField="cooperateClinicNum"
				:dayNum="totalData.periodDates">
			</TotalValue>
		</DashBoardCard>
		<DashBoardCard :filter="pageFilter" :showLastDayValue="false" type="bar" api="getHisSumVisitNum"
			xAxisName="statDate"
			:pageToDetail="{url:'/pagesB/hisDaily/hisVisitAndRecipe/index',title:'诊所接诊单/处方单明细',currentPage,currentFilter,pageFilter}"
			:fieldData="[{key:'visitNum'}]" cardTitle="诊所接诊单" v-if="pageParams.pageNum > 1">
			<TotalValue v-if="totalData" slot="totalValue" :totalData="totalData" totalField="visitNum"
				:dayNum="totalData.periodDates"></TotalValue>
		</DashBoardCard>
		<DashBoardCard :filter="pageFilter" :showLastDayValue="false" type="bar" api="getHisSumRecipeNum"
			xAxisName="statDate"
			:pageToDetail="{url:'/pagesB/hisDaily/hisVisitAndRecipe/index',title:'诊所接诊单/处方单明细',currentPage,currentFilter,pageFilter}"
			:fieldData="[{key:'recipeNum'}]" cardTitle="诊所处方单" v-if="pageParams.pageNum > 1">
			<TotalValue v-if="totalData" slot="totalValue" :totalData="totalData" totalField="recipeNum"
				:dayNum="totalData.periodDates"></TotalValue>
		</DashBoardCard>
		<DashBoardCard :drugTotal="true" :filter="pageFilter" :showLastDayValue="false" v-if="pageParams.pageNum > 2"
			type="pie" api="getHisRecipeDrugs" :fieldData="[{
				key:'drugsNum',	
				type:'valueKey'
			},{
				key:'drugsName',
				type:'nameKey'
			}]" :pageToDetail="{url:'/pagesB/hisDaily/hisRecipeDrugsDetail/index',title:'HIS处方单药品明细',currentPage,currentFilter,pageFilter}"
			cardTitle="诊所处方单药品" :summaryData="summaryData">
		</DashBoardCard>
		<DashBoardCard :filter="pageFilter" :showLastDayValue="false" type="mix" api="getHisActiveClinicNum"
			otherNumberTag="clinicActiveRateSum" :dayNum="totalData.periodDates" :seriesType="['column','line']"
			xAxisName="statDate" :fieldData="[{key:'activeClinicNum'},{key:'clinicActiveRate'}]"
			:pageToDetail="{url:'/pagesB/hisDaily/activeClinic/index',title:'诊所活跃明细',currentPage,currentFilter,pageFilter}"
			:seriesName="['activeClinicNum','clinicActiveRate']" cardTitle="活跃诊所&活跃率" v-if="pageParams.pageNum > 2">
			<view v-if="totalData" slot="totalValue">
				<NumberTag label="总" field="activeClinicNum" :data="totalData.activeClinicNum">
				</NumberTag>
				<text class="totalValue-gap" style="margin:0 16rpx;">|</text>
				<NumberTag label="平均" field="activeClinicNum" :data="totalData.activeClinicNum/totalData.periodDates">
				</NumberTag>

			</view>


		</DashBoardCard>
		<DashBoardCard :filter="pageFilter" growthSpeed="accLogClinicNumGrowthSpeed" :showLastDayValue="false"
			type="mix" api="getHisAccLogClinicNum" xAxisName="statDate"
			:fieldData="[{key:'accLogClinicNum'},{key:'accLogClinicNumRate'}]"
			:seriesName="['accLogClinicNum','accLogClinicNumRate']" :seriesType="['column','line']"
			cardTitle="HIS累计注册诊所数" v-if="pageParams.pageNum > 3">
		</DashBoardCard>
		<DashBoardCard :filter="pageFilter" growthSpeed="accCooperateClinicGrowthSpeed" :showLastDayValue="false"
			type="mix" api="getHisAccCooperateClinicNum" xAxisName="statDate"
			:fieldData="[{key:'accCooperateClinicNum'},{key:'accCooperateClinicNumRate'}]"
			:seriesName="['accCooperateClinicNum','accCooperateClinicNumRate']" :seriesType="['column','line']"
			cardTitle="HIS累计签约诊所数" v-if="pageParams.pageNum > 3">
		</DashBoardCard>
		<DashBoardCard growthSpeed="accRecipeNumGrowthSpeed" :filter="pageFilter" :showLastDayValue="false" type="mix"
			api="getHisAccRecipeNum" :seriesName="['accRecipeNum','accRecipeNumRate']" xAxisName="statDate"
			:fieldData="[{key:'accRecipeNum'},{key:'accRecipeNumRate'}]" :seriesType="['column','line']"
			cardTitle="HIS累计处方单" v-if="pageParams.pageNum > 3">
		</DashBoardCard>
		<!-- <DashBoardCard api="getHisVisitNumStatistic" xAxisName="statDate"
			:fieldData="[{key:'visitNum',showLastDay:true},{key:'averageVisitNum',showLastDay:true}]"
			cardTitle="诊所接诊单&平均接诊单" v-if="pageParams.pageNum > 2">
		</DashBoardCard>
		<DashBoardCard xAxisName="statDate" api="getHisAccCooperateSumStatistic"
			:fieldData="[{key:'accLogClinicNum',showLastDay:true},{key:'accCooperateClinicNum',showLastDay:true}]"
			cardTitle="HIS累计诊所数和签约数" v-if="pageParams.pageNum > 3">
		</DashBoardCard>
		<DashBoardCard xAxisName="statDate" api="getHisAccRecipeSumStatistic"
			:fieldData="[{key:'accVisitNum',showLastDay:true},{key:'accRecipeNum',showLastDay:true}]"
			cardTitle="HIS累计接诊单和处方单" v-if="pageParams.pageNum > 3">
		</DashBoardCard> -->
	</view>
</template>

<script>
	import DashBoardCard from "@/pagesB/components/common/DashBoardCard.vue";
	import SummaryCard from "@/pagesB/components/common/SummaryCard.vue";
	import RankCard from "@/pagesB/components/common/RankCard.vue";
	import TotalValue from '@/pagesB/components/common/TotalValue.vue'
	import NumberTag from '@/pagesB/components/common/NumberTag.vue'
	// import DashBoardFilter from "@/pagesB/components/header/DashBoardFilter/Index.vue";
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from '@/mixins/tabMixin.js'
	const defaultFilter = {
		listRegion: [],
		dateType: 'tmonth'
	};
	export default {
		mixins: [loginMixin, tabMixin],
		components: {
			DashBoardCard,
			SummaryCard,
			RankCard,
			NumberTag,
			// DashBoardFilter,
			DashBoardHeader,
			TotalValue
		},
		data() {
			return {
				show: false,
				currentPage: {
					key: "HISDaily",
					type: "HIS",
				},
				pageFilter: {
					listRegion: [],
					dateType: 'tmonth'
				},
				totalData: null,
				recordId: null,
				isCanUpdate: true,
				pageParams: {
					pageNum: 1
				},
				endPageNum: 3,
				currentFilter: {
					timeKey: "tmonth",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				},
				
			};
		},
		onLoad() {
			console.log(this);
		},
		onShow() {
			this._loginHook_mixin();
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
			if (this.isCanUpdate) {
				this.pageParams.pageNum += 1;
				if (this.pageParams.pageNum > this.endPageNum) {
					this.isCanUpdate = false
				}
			}
		},
		methods: {
			_loginSuccess_mixin() {
				// 防止用户在echart图未渲染的情况下跳转到另外一个页面导致echart渲染失败 强制更新

				uni.$emit('updateChart')
			},
			// 根据当前页面修改过滤条件
			setfilterByCurrentPage() {
				this.currentFilter = {
					timeKey: "n7days",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				};
			},
			setPageFilter(filter) {
				this.pageFilter = filter
			},
			resetFilter() {
				this.setfilterByCurrentPage();
			},
			setCurrentFilterByType(filterKey, key) {
				this.currentFilter[filterKey] = key;
			},
			setTotalData(data) {
				console.log(JSON.stringify(data))
				this.totalData = data
			}
		},
	}
</script>

<style lang="scss">

</style>
