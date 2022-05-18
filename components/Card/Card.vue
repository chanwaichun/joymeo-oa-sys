<template>
	<view class="card" :class="[paddingBottom ? 'padding-bottom' : '']">
		<view class="card-title u-flex u-col-center u-row-between"
			:style="{marginBottom:`${titleMargin}rpx`,fontWeight:titleWeight}">
			<view class="u-flex">
				{{cardTitle}}
				<slot name="titleIcon"></slot>
				<slot name="title-footer"></slot>
			</view>

			<slot name="title-right"></slot>
		</view>
		<view class="card-body">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Card",
		props: {
			titleWeight: {
				type: String,
				default: 'bold'
			},
			cardTitle: {
				type: String,
				default: ''
			},
			paddingBottom: {
				type: Boolean,
				default: false
			},
			titleMargin: {
				type: Number,
				default: 32
			}
		},
	}
</script>

<style lang="scss" scoped>
	.u-cell {
		padding: 23rpx 0rpx;
	}

	.card {
		padding: 30rpx 20rpx 0rpx 20rpx;
		width: 100%;

		background-color: #FFFFFF;

		&.padding-bottom {
			padding-bottom: 30rpx;
		}

		.card-title {
			width: 100%;
			font-size: 36rpx !important;
			font-weight: bold !important;
			color: #333333 !important;
		}

		.card-body {}
	}
</style>
