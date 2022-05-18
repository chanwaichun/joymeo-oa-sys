<template>
	<view class="attend-button-container" :class="[isRegister ? 'register':'unregister']" @click="buttonClick">
		<view class="attend-button-text">
			<text class="item-register">{{isRegister ? '拜访退卡' :'巡店打卡'}}</text>
			<text class="item-time">{{currentTime}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		/**
		 * 组件的属性列表
		 */
		/**
		 * 组件的初始数据
		 */
		data() {
			// 是否已经签
			return {
				currentTime: this.$moment().format('hh:mm:ss'),
				timer: null,
			}

		},

		props: {

			isRegister: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.timer = setInterval(() => {

				this.currentTime = this.$moment().format('hh:mm:ss')

			}, 1000)
		},
		unmounted() {
			clearInterval(this.timer)
		},

		/**
		 * 组件的方法列表
		 */
		methods: {
			buttonClick() {
				this.$emit('buttonClick')
			}
		}
	}
</script>

<style lang="scss">
	.attend-button-container {
		border-radius: 50%;
		width: 240rpx;
		height: 240rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.attend-button-text {
			color: #ffffff;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			.item-register {
				font-size: 36rpx;
			}

			.item-time {
				font-size: 24rpx;
				font-weight: lighter;
			}
		}

		&.register {
			background-color: #008A6C;
			box-shadow: 0px 0px 13px #008A6C;


		}

		&.unregister {
			background-color: #1D4393;
			box-shadow: 0px 0px 13px #1D4393;
		}


	}
</style>
