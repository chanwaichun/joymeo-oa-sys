<template>
	<view class="fixed-btn fixed-bottom" >
		<slot name="left-button"></slot>
		<slot name="right-button"></slot>
	</view>
</template>

<script>
	export default {
		name: "FixedBtn",
	}
</script>

<style lang="scss">
	.fixed-btn {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 20rpx 40rpx 20rpx;
	}
</style>
