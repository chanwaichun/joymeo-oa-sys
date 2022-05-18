<template>
	<view class="taskDataAnalyse">
		<view class="taskDataAnalyse-head">
			<text>昨日数据</text>
			<text>截止到昨日</text>
		</view>
		<view class="taskDataAnalyse-summary">
			<view class="summary-item">
				<view class="item-title"></view>
				<view class="item-value">
					<view class="value-number"></view>
					<view class="value-rate"></view>
				</view>
			</view>
		</view>
		<view class="taskDataAnalyse-chart">
			<ChartColumn></ChartColumn>

		</view>
	</view>
</template>

<script>
	import ChartColumn from '../../../dashBoardComponents/ChartColumn/Index.vue'
	import ChartPie from '../../../dashBoardComponents/ChartPie/Index.vue'
	export default {
		comments: {
			ChartColumn,
			ChartPie
		}
	}
</script>

<style>
</style>
