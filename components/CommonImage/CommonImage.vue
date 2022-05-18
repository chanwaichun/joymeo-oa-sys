<template>

	<image lazy-load="true" mode="scaleToFill" :style="{width,height,display:flex}" :src="currentSrc" @error="setErrorImg()"></image>
</template>

<script>
	// const errorImage =  `${$global.staticAddress}/image/fail_load.png`
	export default {
		props: {
			src: {
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '100rpx'
			},
			height: {
				type: String,
				default: '100rpx'
			}
		},
		data() {
			return {
				currentSrc: this.src || `${this.$global.staticAddress}/image/fail_load.png`
			}
		},
		methods: {
			setErrorImg() {
				this.currentSrc = `${this.$global.staticAddress}/image/fail_load.png`;
			}
		}
	}
</script>

<style>
</style>
