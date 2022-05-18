<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
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
	import RankCard from "@/pagesB/components/common/RankCard.vue";
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from '@/mixins/tabMixin.js'
	const defaultFilter = {
		HIS: {
			listRegion: [],
			dateType: 'today'
		},
	};
	export default {
		mixins: [loginMixin,tabMixin],
		components: {
			RankCard,
			DashBoardHeader,
		},
		data() {
			return {
				currentPage: {
					key: "HotelRank",
					type: "HIS",
				},
				recordId: null,
				currentFilter: {
					timeKey: "today",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				},
				current: 0,
				tabList: [{
						name: "接诊单",
					},
					{
						name: "处方单",
					}
				],
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
				getApp().globalData.filter = defaultFilter.HIS;
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
			}
		},
	}
</script>

<style lang="scss">

</style>
