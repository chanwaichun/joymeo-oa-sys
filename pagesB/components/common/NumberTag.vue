<template>
	<text class="totalValue-value">{{label}}：<text class="text">{{setValue()}}</text><text
			class="unit">{{fieldBigData.getFieldAttribute(field,'unitCN')}}</text></text>
</template>

<script>
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	export default {
		props: {
			label: {
				type: String,
				default: ''
			},
			field: {
				type: String,
				default: ''
			},
			data: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				fieldBigData
			}
		},
		methods: {
			setValue() {
				const currentValue = fieldBigData.format(this.field, this.data);
				return this.$util.setPriceAbridge(currentValue)
			},
			setAverage() {
				return (this.totalData[this.totalField] / this.dayNum).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.totalValue-value {
		font-size: 28rpx;
		.text {
			font-size: 32rpx;

		}

	}

</style>
