<template>
	<view class="progressBar" :class="[type]">
		<view class="progressBar-circle" v-if="type==='circle'">
			<view class="circle-progress-outer"
				:style="{background:`conic-gradient(${backgroundColor} ${100 - (rate||0)}%, ${mainColor} ${100 - (rate||0)}% 100%)`}">
				<view class="circle-progress-inner"
					:style="{backgroundImage:backgroundImage ?`url(${backgroundImage})`:'none'}">
					<view class="u-progress-content">
						<view class="u-progress-number u-font-72" :style="{color:textColor}">
							{{rate||0}}%
						</view>
						<text class='u-progress-text u-flex u-row-center'>{{circleBottomText}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="progressBar-slip" :style="{backgroundColor}" v-else>
			<view class="slip-progress"
				:style="{background:`linear-gradient(90deg,${startColor},${mainColor})`,width:`${rate}%`}">
				{{rate||0}}%
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ProgressBar',
		props: {
			// 公共

			mainColor: {
				type: String,
				default: '#000000'
			},
			backgroundColor: {
				type: String,
				default: '#ececec'
			},
			rate: {
				type: Number,
				default: 0,
			},
			type: {
				type: String,
				default: 'circle'
			},
			// circle形状通用
			textColor: {
				type: String,
				default: '#000000'
			},

			backgroundImage: {
				type: String,
				default: ''
			},
			circleBottomText: {
				type: String,
				default: '进度'
			},
			//开始渐变的颜色
			startColor: {
				type: String,
				default: '#FFFFFF'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.progressBar {
		&.circle {
			position: relative;
			width: 250rpx;
			height: 250rpx;
		}

		&.slip {
			width: 100%;
			padding: 14rpx 0rpx;
		}

		.progressBar-circle {

			.circle-progress-outer,
			.circle-progress-inner {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				margin: auto;
				border-radius: 50%;
			}

			.circle-progress-outer {
				width: 100%;
				height: 100%;
			}

			.circle-progress-inner {
				width: 88%;
				height: 88%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #FFFFFF;
			}

			.u-progress-number {
				font-size: 72rpx;
			}
		}

		.progressBar-slip {
			width: 100%;
			height: 20rpx;
			border-radius: 10rpx;

			.slip-progress {
				color:#FFFFFF;
				font-size: 16rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding-right: 10rpx;
				height: inherit;
				border-radius: 10rpx;
			
			}
		}
	}
</style>
