<template>
	<view class="hisDaily">
		<SummaryCard api="getHisYesterdayData" :fieldData="[{
			key:'logClinicNum',
			dayRatioKey:'clinicNumGrowthByDay'
		},{
			key:'patientNum',
			dayRatioKey:'patientNumGrowthByDay'
		},{
			key:'visitVum',
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
			key:'averageRecipeNum',
			dayRatioKey:'averageRecipeNumGrowthByDay',
		},{
			key:'warehouseSkuNum',
			dayRatioKey:'warehouseSkuNumGrowthByDay',
		}]" cardTitle="昨日数据"></SummaryCard>
		<DashBoardCard type="bar" api="getHisNewClinicStatistic" xAxisName="statDate"
			:fieldData="[{key:'logClinicNum',showLastDay:true}]" cardTitle="HIS注册数">
		</DashBoardCard>
		<DashBoardCard type="bar" api="getHisCooperateStatistic" xAxisName="statDate"
			:fieldData="[{key:'cooperateClinicNum',showLastDay:true}]" cardTitle="HIS签约数">
		</DashBoardCard>
		<DashBoardCard type="bar" api="getHisRecipeStatistic" xAxisName="statDate"
			:fieldData="[{key:'visitNum',showLastDay:true},{key:'recipeNum',showLastDay:true}]" cardTitle="诊所接诊单&处方单"
			v-if="pageParams.pageNum > 1">
		</DashBoardCard>

		<DashBoardCard type="mix" api="getHisActiveStatistic" :seriesType="['column','line']" xAxisName="statDate"
			:fieldData="[{key:'activeClinicNum',showLastDay:true},{key:'clinicActiveRate',showLastDay:true}]"
			:seriesName="['activeClinicNum','clinicActiveRate']" cardTitle="活跃诊所&活跃率"
			v-if="pageParams.pageNum > 1">
		</DashBoardCard>
		<DashBoardCard api="getHisVisitNumStatistic" xAxisName="statDate"
			:fieldData="[{key:'visitNum',showLastDay:true},{key:'averageVisitNum',showLastDay:true}]"
			cardTitle="诊所接诊单&平均接诊单" v-if="pageParams.pageNum > 2">
		</DashBoardCard>
		<DashBoardCard xAxisName="statDate" api="getHisAccCooperateSumStatistic"
			:fieldData="[{key:'accLogClinicNum',showLastDay:true},{key:'accCooperateClinicNum',showLastDay:true}]"
			cardTitle="HIS累计诊所数和签约数" v-if="pageParams.pageNum > 2">
		</DashBoardCard>
		<DashBoardCard xAxisName="statDate" api="getHisAccRecipeSumStatistic"
			:fieldData="[{key:'accVisitNum',showLastDay:true},{key:'accRecipeNum',showLastDay:true}]"
			cardTitle="HIS累计接诊单和处方单" v-if="pageParams.pageNum > 3">
		</DashBoardCard>
	</view>

</template>

<script>
	import tabMixin from '@/mixins/tabMixin.js'
	import SummaryCard from '../components/common/SummaryCard.vue'
	import DashBoardCard from '../components/common/DashBoardCard.vue'
	export default {
		mixins: [tabMixin],
		components: {
			DashBoardCard,
			SummaryCard
		},
		data() {
			return {
				isCanUpdate: true,
				pageParams: {
					pageNum: 1
				},
				currentNum: 1
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
	}
</script>

<style>
</style>
