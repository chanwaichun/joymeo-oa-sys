<template>
	<view class="hotelRank">
		<u-tabs class="saleRank-tab" bgColor="#FFFFFF" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
			:is-scroll="false" :current="current" @change="tabChange"></u-tabs>
		<view class="hotelRank-outpatient" v-if="current === 0">
			<RankCard :showSort="true" :showHeader="true" :rankHeader="[
			{key:'clinicName',keyName:'诊所',showNullBan:true},
			{key:'cityName',keyName:'城市',showNullBan:true},
			{key:'salesmanName',keyName:'负责人',showNullBan:true},
			{key:'visitNum',keyName:'接诊单数'}
				]" rankValue='visitNumRank' api="getHisClinicVisitNumRanking" cardTitle="接诊单数排行榜">
			</RankCard>
		</view>
		<view class="hotelRank-recipeSheet" v-else>
			<RankCard :showSort="true" :showHeader="true" :rankHeader="[
			{key:'clinicName',keyName:'诊所',showNullBan:true},
			{key:'cityName',keyName:'城市',showNullBan:true},
			{key:'salesmanName',keyName:'负责人',showNullBan:true},
			{key:'recipeNum',keyName:'处方单数'}
				]" rankValue='recipeNumRank' api="getHisClinicRecipeNumRanking" cardTitle="处方单量排行榜">
			</RankCard>
		</view>
	</view>
</template>

<script>
	import RankCard from "../components/common/RankCard.vue"
	export default {
		components: {
			RankCard
		},
		data() {
			return {
				current: 0,
				tabList: [{
						name: "接诊单",
					},
					{
						name: "处方单",
					}
				],
			}
		},
		methods: {
			tabChange(index) {
				this.current = index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hotelRank {

		.hotelRank-outpatient,
		.hotelRank-recipeSheet {
			background-color: #FFFFFF;
		}

		.hotelRank-outpatient {}

		.hotelRank-recipeSheet {}
	}
</style>
