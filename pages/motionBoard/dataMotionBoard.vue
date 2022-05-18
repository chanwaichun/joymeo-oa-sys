<template>
	<web-view v-if="!isLoading" :src="`${webViewDomain}/previewMobile/index.html?type=${params}?token=${token}`">
	</web-view>
</template>

<script>
	export default {
		data() {
			return {
				webViewDomain: `${this.$global[`${this.$global.mode}WebView`]}`,
				token: uni.getStorageSync("token"),
				params: new Date().getTime(),
				isLoading: true,
			};
		},
		onShow() {
			this.isLoading = true;
			this.params = new Date().getTime();
			this.token = uni.getStorageSync("token");
			this.timer = setTimeout(() => {
				this.isLoading = false
			}, 100)
		},
		onHide()
		{
			clearTimeout(this.timer)
		}
	}
</script>

<style lang="scss">

</style>
