<template>
	<view class="u-flex u-row-center u-col-center pageLoading">
		<u-loading mode="flower" size="64"></u-loading>
	</view>
</template>

<script>
	export default {
		name:"PageLoading",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.pageLoading
{
	width: 100%;
	height: 100vh;
}
</style>
