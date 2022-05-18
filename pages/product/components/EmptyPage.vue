<template>
	<view class="emptyPage" :class="[size]">
		<view class="emptyPage-container">
			<image class="container-image" :src="src"></image>
			<view class="container-text" :key="index" v-for="(item,idnex) in emptyText.split(',')">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	const common = 'common'
	export default {

		props: {
			size: {
				type: String,
				default: 'page'
			},
			emptyText: {
				type: String,
				default: '暂无数据'
			},
			type: {
				type: String,
				default: 'common'
			}
		},
		data() {
			return {
				src: `${this.$global.staticAddress}/image/empty_${this.type ?this.type: common}.png`
			}
		}

	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.emptyPage {
		&.page {
			pointer-events: none;
			position: absolute;
			margin: auto;
			z-index: 10;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&.component {
			width: 100%;
			height: 100%;
			padding: 100rpx 0;
			.emptyPage-container {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.container-image {
					width: 200rpx;
					height: 200rpx;
				}

				.container-text {
					font-size: 24rpx;
					color: $common-grey-1
				}
			}
		}


		.emptyPage-container {
			text-align: center;

			.container-image {
				width: 200rpx;
				height: 200rpx;
			}

			.container-text {
				font-size: 24rpx;
				color: $common-grey-1
			}
		}

	}
</style>
