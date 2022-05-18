<template>
	
	<view class="general">
		
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
			cardTitle="登录人数">
		</DashBoardCard>
		<DashBoardCard api="getNewClinicStatistic" xAxisName="statDate"
			:fieldData="[{key:'expClinicNumSum',showLastDay:true}]" cardTitle="新增诊所数"></DashBoardCard>
		<DashBoardCard api="getClockNumStatistic" xAxisName="statDate"
			:fieldData="[{key:'clockUserNum',showLastDay:true}]" cardTitle="打卡人数">
		</DashBoardCard>
		<DashBoardCard api="getPaymentStatistic" xAxisName="statDate"
			:fieldData="[{key:'salesAmountSum',showLastDay:true}]" cardTitle="货款报备金额">
		</DashBoardCard>
	</view>

</template>

<script>
	import DashBoardCard from '../components/common/DashBoardCard.vue'
	import SummaryCard from '../components/common/SummaryCard.vue'
	export default {
		components: {
			DashBoardCard,
			SummaryCard
		},
	}
</script>

<style lang="scss">
</style>
