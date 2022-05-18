<template>
	<view class="totalValue" v-if="dayNum > 0 ">
		<text class="totalValue-value">总：<text class="text">{{totalData[totalField].toFixed(2)}}</text><text
				class="unit">{{fieldBigData.getFieldAttribute(totalField,'unitCN')}}</text></text>
		<text class="totalValue-gap">|</text>
		<text class="totalValue-average">平均：<text class="text">{{setAverage()}}</text><text
				class="unit">{{fieldBigData.getFieldAttribute(totalField,'unitCN')}}</text></text>
	</view>
</template>

<script>
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	export default {
		props: {
			totalData:{
				type: Object,
				default: 0
			},
			totalField: {
				type: String,
				default: 0
			},
			dayNum: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				fieldBigData
			}
		},
		methods: {
			setAverage() {
				return (this.totalData[this.totalField] / this.dayNum).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.totalValue {
		font-size: 24rpx;
		.totalValue-gap {
			margin: 12rpx;
		}

		.totalValue-value,
		.totalValue-average {
			.text {
				font-size: 32rpx;
			}

		}
	}
</style>
