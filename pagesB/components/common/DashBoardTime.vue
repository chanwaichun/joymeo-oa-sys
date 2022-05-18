<template>
	<view class="dashBoardCardTime" v-if="filterTime">
		<text class="time-range">{{filterTime.currentRange}}</text><text class="time-range">|</text><text
			class="time-key">{{filterTime.currentKey}}</text>
	</view>
</template>

<script>
	import util from '@/pagesB/utils/index.js'
	export default {
		props: {
			filter: {
				type: Object,
				default: () => null
			}
		},
		data() {
			return {
				filterTime: null,
			}
		},
		watch: {
			filter(val) {
				this.filterTime = util.setFilterTime(this.filter);
			}
		},
		mounted() {

			if (this.filter) {
				this.filterTime = util.setFilterTime(this.filter);

			} else {
				let filter = getApp().globalData.filter;
				this.filterTime = util.setFilterTime(filter);
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.dashBoardCardTime {
		margin-bottom: 32rpx;

		.time-range {
			font-size: 24rpx;
			color: $common-grey-1;
			margin-right: 10rpx;

		}

		.time-key {
			font-size: 24rpx;
			color: #0D0D0D;
			margin-left: 10rpx;

		}
	}
</style>
