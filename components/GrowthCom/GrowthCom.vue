<template>
	<view class="growthCom">
		<u-icon v-if="value != 0" :class="[setClassFromValue(value)]"
			:name=" value > 0 ? 'arrow-up-fill':'arrow-down-fill' " size="18">
		</u-icon>
		<text :class="[setClassFromValue(value)]">
			<!-- summaryData[`${item.key}Growth`] > 0? -->
			{{fieldBigData.format(propsKey, value, {isNeedUnit: true})}}
		</text>
	</view>
</template>

<script>
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	export default {
		name: "GrowthCom",
		props: {
			iconShow: {
				type: Boolean,
				default: false
			},
			value: {
				type: Number,
				default: 0
			},
			propsKey: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				fieldBigData
			};
		},
		methods: {
			setClassFromValue(value) {
				if (value > 0) {
					return 'up'
				} else if (value < 0) {
					return 'down'
				} else {
					return 'invariant'
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "@/common/common.scss";

	.growthCom {
		font-size: 24rpx;

		.up {
			color: #14c4a2;
		}

		.down {
			color: #ff6b5c;
		}

		.invariant {
			color: $common-grey-1;
		}
	}
</style>
