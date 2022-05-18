<template>
	<view class="tagImage" :class="[require ? 'tagImage-require' :'']">
		<CommonImage :width="width" :height="height" :src="src"></CommonImage>
	</view>
</template>

<script>
	import CommonImage from '@/components/CommonImage/CommonImage.vue'
	export default {
		components:{
			CommonImage
		},
		props: 	{
			src: {
				type: String,
				default: ''
			},
			require: {
				type: Boolean,
				default: true
			},
			height: {
				type: String,
				default: '200rpx'
			},
			width: {
				type: String,
				default: '200rpx'
			}

		}
	}
</script>

<style lang="scss" scoped>
	.tagImage {
		overflow: hidden;
		border-radius: 16rpx;
		padding: 18rpx;
		background-color: #F7F7F7;

		&.tagImage-require {
			position: relative;
			border: 1px solid #E5EFFF;

			background: none;

			&::before {
				padding: 6rpx 14rpx;
				color: #1D4393;
				font-size: 24rpx;
				border-bottom-right-radius: 16rpx;
				content: '必填';
				display: block;
				height: 34rpx;
				background-color: #E5EFFF;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
		}
	}
</style>
