<template>
	<view class="common-dashBoard-container" v-if="currentPage && currentFilter && pageFilter">
		<DashBoardHeader :isDrill="true" :title="title" :currentFilter="currentFilter" :propsFilter="filter"
			:currentPage="currentPage" @resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType"
			@setPageFilter="setPageFilter">
		</DashBoardHeader>
		<RankCard :propsFilter="pageFilter" :showRank="false" :showSort="false" :showHeader="true" :showTime="true"
			:rankHeader="[
						{key:'clinicName',keyName:'诊所'},
						{key:'clinicCity',keyName:'城市'},
						{key:'saleName',keyName:'负责人'},
						{key:'logTime',keyName:'签约时间'}
					]" :titleMargin="0" api="getHisCooperateClinicNumDetail" :fetchByPage="true">
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
		}
	}
</script>

<style>
</style>
