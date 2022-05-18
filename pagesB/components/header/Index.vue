<template>
	<view class="dataDashBoard-header fixed-top u-flex">
		<view v-if="title" class="header-title">
			{{title}}
		</view>
		<view v-else class="header-tabs">

			<DashBoardTabs></DashBoardTabs>
		</view>

		<view class="header-filter">

			<DashBoardFilter :filterParams="filterParams" :isDrill="isDrill" :currentFilter="currentFilter"
				:propsFilter="filter" :currentPage="currentPage" @resetFilter="resetFilter"
				@setCurrentFilterByType="setCurrentFilterByType" @setPageFilter="setPageFilter">
			</DashBoardFilter>
		</view>



	</view>
</template>

<script>
	import DashBoardFilter from '../header/DashBoardFilter/Index.vue'
	import DashBoardTabs from '../header/DashBoardTabs/Index.vue'
	export default {
		components: {
			DashBoardFilter,
			DashBoardTabs
		},
		props: {
			isDrill: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			currentFilter: {
				type: Object,
				default: () => {},
			},
			filter: {
				type: Object,
				default: () => {},
			},
			currentPage: {
				type: Object,
				default: () => {},
			},
		},
		data() {
			return {
				filterParams: getApp().globalData.filterParams
			}
		},
		methods: {
			resetFilter() {
				this.$emit("resetFilter");
			},
			setCurrentFilterByType(filterKey, key) {
				this.$emit("setCurrentFilterByType", filterKey, key);
			},
			setPageFilter(filter) {
				this.$emit("setPageFilter", filter);
			}
		},
	};
</script>

<style lang="scss">
	.dataDashBoard-header {
		/* border: 1px solid $common-border-color; */
		/* height: 40px; */
		box-sizing: border-box;
		background-color: #ffffff;
		width: 100%;

		.header-title {
			font-weight: bold;
			font-size: 32rpx;
			padding-left: 32rpx;
		}

		.header-tabs,
		.header-title {
			width: calc(100% - 120rpx);
		}

		.header-filter {
			height: 120rpx;
			width: 120rpx;
		}
	}
</style>
