<template>
	<view class="common-dashBoard-container" v-if="currentPage && currentFilter && pageFilter">
		<DashBoardHeader :isDrill="true" :title="title" :currentFilter="currentFilter" :propsFilter="filter"
			:currentPage="currentPage" @resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType"
			@setPageFilter="setPageFilter">
		</DashBoardHeader>
		<u-tabs class="rank-tab" bgColor="none" activeColor="#1D4393" inactiveColor="#000000" :list="tabList"
			:is-scroll="false" :current="current" @change="tabChange">
		</u-tabs>
		<RankCard v-if="current === 0" :propsFilter="pageFilter" :showSort="true" :showHeader="true" :showTime="true"
			:rankHeader="[
				
						{key:'clinicName',keyName:'诊所'},
						{key:'clinicCity',keyName:'城市'},
						{key:'saleName',keyName:'负责人'},
						{key:'visitNum',keyName:'接诊单数'}
					]" rankValue='visitNumRank' :titleMargin="0" api="getHisVisitNumDetail" cardTitle="接诊单数排行榜" :fetchByPage="true">
		</RankCard>
		<RankCard v-else :propsFilter="pageFilter" :showSort="true" :showHeader="true" :showTime="true" :rankHeader="[
						{key:'clinicName',keyName:'诊所'},
						{key:'clinicCity',keyName:'城市'},
						{key:'saleName',keyName:'负责人'},
						{key:'recipeNum',keyName:'处方单数'}
					]" :titleMargin="0" rankValue='recipeNumRank' api="getHisSumRecipeNumDetail" cardTitle="处方单量排行榜"
			:fetchByPage="true">
		</RankCard>
	</view>
</template>

<script>
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import RankCard from '@/pagesB/components/common/RankCard.vue'
	import loginMixin from "@/mixins/loginMixin.js";
	import tabMixin from "@/mixins/tabMixin.js";
	export default {
		mixins: [loginMixin, tabMixin],
		components: {
			DashBoardHeader,
			RankCard
		},
		onShow() {
			this._loginHook_mixin();
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
		},
		onLoad(options) {
			const {
				title,
				currentFilter,
				currentPage,
				pageFilter
			} = options
			this.pageFilter = JSON.parse(pageFilter)
			this.currentFilter = JSON.parse(currentFilter)
			this.currentPage = JSON.parse(currentPage)
			this.title = title
			console.log(this.currentFilter, this.currentPage)
		},
		data() {
			return {
				title: null,
				currentFilter: null,
				currentPage: null,
				pageFilter: null,
				current: 0,
				tabList: [{
						name: "接诊单数排行榜",
					},
					{
						name: "处方单量排行榜"
					}
				]
			}
		},
		methods: {
			_loginSuccess_mixin() {},
			setfilterByCurrentPage() {
				this.currentFilter = {
					timeKey: "today",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				};
			},
			setPageFilter(filter) {
				console.log(filter)
				this.pageFilter = filter
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
		}
	}
</script>

<style>
</style>
