<template>
	<view class="dataDashBoard">
		<view class="dataDashBoard-header u-flex u-row-between u-col-center fixed-top">
			<DashBoardSelect @itemClick="itemClick" @submit="submit"></DashBoardSelect>
			<DashBoardFilter :currentFilter="currentFilter" :propsFilter="filter" :currentPage="currentPage"
				@resetFilter="resetFilter" @setCurrentFilterByType="setCurrentFilterByType">
			</DashBoardFilter>
		</view>
		<!-- tab切换 -->
		<view class="dataDashBoard-content">
			<General v-if="currentPage.key === 'General'"></General>
			<SaleRank v-if="currentPage.key === 'SaleRank'"></SaleRank>
			<PurchaseAnalyse v-if="currentPage.key === 'PurchaseAnalyse'"></PurchaseAnalyse>
			<ClockRank v-if="currentPage.key === 'ClockRank'"></ClockRank>
			<HISDaily v-if="currentPage.key === 'HISDaily'"></HISDaily>
			<HotelRank v-if="currentPage.key === 'HotelRank'"></HotelRank>
			<MotionDaily v-if="currentPage.key === 'MotionDaily'"></MotionDaily>
			<OTCAnalyse v-if="currentPage.key === 'OTCAnalyse'"></OTCAnalyse>
		</view>
	</view>
</template>

<script>
	import DashBoardSelect from '@/pagesB/dashBoard/components/header/DashBoardSelect/Index.vue'
	import DashBoardFilter from '@/pagesB/dashBoard/components/header/DashBoardFilter/Index.vue'
	import General from '@/pagesB/dashBoard/tabComponents/General.vue'
	import SaleRank from '@/pagesB/dashBoard/tabComponents/SaleRank.vue'
	import PurchaseAnalyse from '@/pagesB/dashBoard/tabComponents/PurchaseAnalyse.vue'
	import ClockRank from '@/pagesB/dashBoard/tabComponents/ClockRank.vue'
	import HISDaily from '@/pagesB/dashBoard/tabComponents/HISDaily.vue'
	import HotelRank from '@/pagesB/dashBoard/tabComponents/HotelRank.vue'
	import MotionDaily from '@/pagesB/dashBoard/tabComponents/MotionDaily.vue'
	import OTCAnalyse from '@/pagesB/dashBoard/tabComponents/OTCAnalyse.vue'
	import Card from '@/components/Card/Card.vue'
	import loginMixin from '@/mixins/loginMixin.js'
	import tabMixin from '@/mixins/tabMixin.js'
	import apiConfig from '@/config/apiConfig.js'
	import {
		allRequestCancel
	} from '@/http/httpCancel.js'
	// 存放默认筛选条件
	const defaultFilter = {
		BD: {
			deptId: '1',
			dateType: 'n7days',
		},
		HIS: {
			listRegion: [],
			dateType: 'today'
		},
		OTC: {
			deptId: '',
			dateType: 'yesterday',
			listRegion: [],
			drugId: '',
			classifyId: ''
		}
	}


	export default {
		mixins: [loginMixin, tabMixin],
		components: {
			DashBoardSelect,
			DashBoardFilter,
			Card,
			General,
			SaleRank,
			PurchaseAnalyse,
			ClockRank,
			HISDaily,
			HotelRank,
			MotionDaily,
			OTCAnalyse

		},
		data() {
			return {
				currentPage: {
					key: 'General',
					type: 'BD'
				},
				recordId: null,
				currentFilter: {
					timeKey: 'today',
					deptKey: 'parentDept',
					regionKey: 'allRegion',
					drugKey: 'allDrug',
					classifyKey: 'allClassify'
				}
			}
		},
		onReachBottom() {
			this._tabPageReachBottom_mixins()
		},
		onShow() {
			this._loginHook_mixin();
		},
		onUnload() {
			uni.$off('rankFilter')
			uni.$off('contentFilter')
			this.setLeavePage()
		},
		onHide() {
			this.setLeavePage()
		},
		methods: {
			_loginSuccess_mixin() {
				this.setBrowsePage();
				if (this.currentPage.key === 'General') {
					getApp().globalData.filter = this.setfilterByCurrentPage(this.currentPage)
				}
			},
			itemClick(item) {
				// 取消所有请求
				allRequestCancel();
				getApp().globalData.filter = this.setfilterByCurrentPage(item)
			},
			resetFilter() {
				this.setfilterByCurrentPage(this.currentPage)
			},
			// 根据当前页面修改过滤条件
			setfilterByCurrentPage(currentPage) {
				const {
					key,
					type
				} = currentPage
				let newfilter = defaultFilter[type]
				const tmonthKey = ['SaleRank'];
				const n7daysKey = ['HISDaily', 'General', 'PurchaseAnalyse'];
				const yesterdayKey = ['OTCAnalyse']
				if (tmonthKey.includes(key)) {
					// this.currentTimeKey = 'tmonth'
					this.currentFilter.timeKey = 'tmonth'
				} else if (n7daysKey.includes(key)) {
					// this.currentTimeKey = 'n7days'
					this.currentFilter.timeKey = 'n7days'
				} else if (yesterdayKey.includes(key)) {
					this.currentFilter.timeKey = 'yesterday'
				} else {
					this.currentFilter.timeKey = 'today'
				}
				this.currentFilter.deptKey = 'parentDept'
				this.currentFilter.drugKey = 'allDrug'
				this.currentFilter.classifyKey = 'allClassify'
				this.currentFilter.regionKey = 'allRegion'
				this.currentPage = {
					key: currentPage.key,
					type: currentPage.type
				}
				return {
					...newfilter,
					dateType: this.currentFilter.timeKey,
				}
			},
			// 设置进入后记录
			setBrowsePage() {
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.setBrowsePage, {
					staffId
				}).then((res) => {
					this.recordId = res.data
				})
			},
			// 设置离开后记录
			setLeavePage() {
				if (this.recordId) {
					// debugger;
					this.$requestData(apiConfig.setLeavePage, {
						recordId: this.recordId
					})
				}
			},
			// 新加的統一方法 修改筛选条件根据筛选的key
			setCurrentFilterByType(filterKey, key) {
				this.currentFilter[filterKey] = key;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.dataDashBoard {
		min-height: 100vh;
		padding: 130rpx 20rpx 20rpx 20rpx;
		background-color: #F7F7F7;

		.dataDashBoard-header {
			border: 1px solid $common-border-color;
			box-sizing: border-box;
			background-color: #FFFFFF;
			padding: 28rpx;
			width: 100%;
		}

	}
</style>
