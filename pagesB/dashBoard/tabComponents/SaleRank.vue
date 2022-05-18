<template>
	<view class="saleRank">
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
	import SummaryTitle from '../components/common/SummaryTitle.vue'
	import RankCard from "../components/common/RankCard.vue"
	export default {
		components: {
			RankCard,
			SummaryTitle
		},
		data() {
			return {
				current: 0,
				tabList: [{
						name: "考核业绩红榜",
					},
					{
						name: "考核业绩黑榜"
					}
				]
			}

		},
		methods: {
			tabChange(index) {
				this.current = index
			},
		}
	}
</script>

<style>
	.saleRank-rank {
		background-color: #FFFFFF;
	}
</style>
