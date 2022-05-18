<template>
	<view class="commonNumberBox u-flex">
		<view class="commonNumberBox-minus" @click="numberMinus">
			<u-icon name="minus" :size="size"></u-icon>
		</view>
		<input :disabled="disabled":cursor-spacing="getCursorSpacing" :value="value" class="commonNumberBox-input" type="number"
			:maxlength="maxlength" :style="{
				fontSize:size,
				width:'80rpx',
				height:'50rpx',
				textAlign:'center',
			}" @input="inputChange" @blur="inputBlur" />
		<view class="commonNumberBox-plus" @click="numberPlus">
			<u-icon name="plus" :size="size">
			</u-icon>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			index: {
				type: Number,
				default: 0
			},
			disabled:{
				type: Boolean,
				default: false
			},
			size: {
				type: String,
				default: '26rpx'
			},
			value: {
				type: Number,
				default: 0
			},
			maxlength: {
				type: Number,
				default: 4
			}
		},
		methods: {
			numberMinus() {
				if (Number(this.value) > 0) {
					let value = Number(this.value) - 1
					this.$emit('change', {
						value,
						index: this.index
					})
				}

			},
			numberPlus() {
				if (Number(this.value) < 9999) {
					let value = Number(this.value) + 1
					this.$emit('change', {
						value,
						index: this.index
					})
				}

			},
			inputChange(data) {
				const {
					detail: {
						value
					}
				} = data
				let newValue = value
				if (isNaN(value)) {
					newValue = 0
				}
				this.$emit('change', {
					value: newValue,
					index: this.index
				})
			},
			inputBlur(data) {
				const {
					detail: {
						value
					}
				} = data
				if (!value.trim() || !value) {
					this.$emit('change', {
						value: 0,
						index: this.index
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.commonNumberBox-minus {
		background-color: #FFFFFF;
		color: #1D4393;
		margin-right: 8rpx;
	}

	.commonNumberBox-plus {
		background-color: #1D4393;
		color: #FFFFFF;
		margin-left: 8rpx;

	}

	.commonNumberBox-plus,
	.commonNumberBox-minus {
		display: flex;
		border: 1px solid #1D4393;
		border-radius: 50%;
		width: 40rpx;
		height: 40rpx;
		justify-content: center;
		align-items: center;
	}
</style>
