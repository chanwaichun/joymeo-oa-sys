<template>
	<view class="common-dashBoard-container">
		<DashBoardHeader :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
			@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
		</DashBoardHeader>
		<DashBoardCard api="getHisClinicCooperateNum" :seriesName="['cooperateRate']"
			:fieldData="[{key:'cooperateClinicNum',showLastDay:true}]" type="arcbar" cardTitle="HIS门诊签约数">
		</DashBoardCard>
		<DashBoardCard api="getHisClinicActiveNum" :seriesName="['activeRate']"
			:fieldData="[{key:'activeClinicNum',showLastDay:true}]" type="arcbar" cardTitle="活跃诊所">
		</DashBoardCard>
		<DashBoardCard api="getHisVisitNum" :seriesName="['visitRate']" :fieldData="[{key:'visitNum',showLastDay:true}]"
			type="arcbar" cardTitle="接诊单">
		</DashBoardCard>
		<DashBoardCard api="getHisRecipeNum" :fieldData="[{key:'recipeNum',showLastDay:true}]"
			:seriesName="['recipeRate']" type="arcbar" cardTitle="处方单">
		</DashBoardCard>
	</view>
</template>

<script>
	import RankCard from "@/pagesB/components/common/RankCard.vue";
	import DashBoardHeader from "@/pagesB/components/header/Index.vue";
	import DashBoardCard from "@/pagesB/components/common/DashBoardCard.vue";
	import loginMixin from "@/mixins/loginMixin.js";
	const defaultFilter = {
		HIS: {
			listRegion: [],
			dateType: 'today'
		},
	};
	export default {
		mixins: [loginMixin],
		components: {
			DashBoardCard,
			DashBoardHeader
		},
		onReachBottom() {
		
			if (this.isCanUpdate) {
				this.pageParams.pageNum += 1;
				if (this.pageParams.pageNum > 3) {
					this.isCanUpdate = false
				}
			}
		},
		data() {
			return {
				currentPage: {
					key: "MotionDaily",
					type: "HIS",
				},
				currentFilter: {
					timeKey: "today",
					deptKey: "parentDept",
					regionKey: "allRegion",
					drugKey: "allDrug",
					classifyKey: "allClassify",
				},
				isCanUpdate:false,
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
