<template>
	<view class="dataDashBoard-header u-flex u-row-between u-col-center fixed-top">
		<slot name="icon"/>
	</view>
</template>

<script>
</script>

<style>
	@import '@/common/common.scss';

	.dataDashBoard-header {
		border: 1px solid $common-border-color;
		box-sizing: border-box;
		background-color: #FFFFFF;
		padding: 28rpx;
		width: 100%;
	}
</style>
