<template>
	<view class="capsuleTab">
		<view v-for="(item,index) in tabList" :key="index" class="capsuleTab-item" :class="[currentValue === index ? 'active' : '',
			index === 0 ? 'capsuleTab-item-left' : '',
			index === tabList.length-1 ? 'capsuleTab-item-right' : '',
			disabled ? 'capsuleTab-item-disabled' : ''
			]" @click="tabItemClick(item,index)">
			<view class="item-text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "CapsuleTab",
		props: {
			tabList: {
				type: Array,
				default () {
					return [{
						value: 0,
						text: '选项一'
					}, {
						value: 1,
						text: '选项二'
					}, {
						value: 2,
						text: '选项三'
					}]
				}
			},
			disabled: {
				type: Boolean,
				default: false
			},
			current: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				currentValue: this.current
			};
		},
		methods: {
			tabItemClick(item, index) {
				if (!this.disabled && index !== this.currentValue) {
					this.currentValue = index;
					this.$emit('capsuleClick', item, index)
				}
			}
		}
	}
</script>

<style lang="scss">
	$radius:30rpx;

	$activeColor:#010101;
	$disabledColor:#010101;

	.capsuleTab {
		display: flex;

	}

	.capsuleTab-item {

		padding: 12rpx 0rpx 12rpx 20rpx;
		font-size: 24rpx;
		background-color: #F7F7F7;
		border-top: 2rpx solid #F0F0F0;
		border-bottom: 2rpx solid #F0F0F0;
		color: #B3B3B3;

		.item-text {
			font-weight: bold;
			padding-right: 20rpx;
			border-right: 4rpx solid #E6E6E6;
		}

		&.active {
			color: $activeColor
		}

		&.capsuleTab-item-left {
			border-top-left-radius: $radius;
			border-bottom-left-radius: $radius;
			border-top: 2rpx solid #F0F0F0;
			border-bottom: 2rpx solid #F0F0F0;
			border-left: 2rpx solid #F0F0F0;
			// border-right: 2rpx solid #E6E6E6;

		}

		&.capsuleTab-item-right {
			border-top-right-radius: $radius;
			border-bottom-right-radius: $radius;
			border-top: 2rpx solid #F0F0F0;
			border-bottom: 2rpx solid #F0F0F0;
			border-right: 2rpx solid #F0F0F0;

			.item-text {
				border-right: 0rpx;
			}
		}

		&.capsuleTab-item-disabled {
			opacity: 0.4;
		}

	}

	.capsuleTab-item::after {
		display: block;
		width: 2rpx;
		height: 26rpx;
	}
</style>
