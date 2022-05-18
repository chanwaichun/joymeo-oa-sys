<template>
	<view class="clockRank">
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
	import SummaryCard from '../components/common/SummaryCard.vue'
	import RankCard from "../components/common/RankCard.vue"
	export default {
		components: {
			RankCard,
			SummaryCard,
		}
	}
</script>

<style>
</style>
