<template>
	<view class="labelSelect u-flex u-flex-wrap">
		<view class="labelSelect-item" v-for="(item,index) in labelData" :key="item[keyName]">
			<view class="item-container" :class="[current.includes(item[keyName])?'active':'']"
				@click="itemClick(item,current.includes(item[keyName]))">
				{{item.labelName}}
			</view>

		</view>
		<view class="labelSelect-item getMore" v-if="labelCount >= 9  ">
			<view class="item-container" @click="getMore" v-if="labelData.length < labelCount">
				更多<u-icon name="arrow-down"></u-icon>
			</view>
			<view class="item-container" v-else @click="collapse">
				收起<u-icon name="arrow-up"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 以什么字段作为唯一值
			keyName: {
				type: String,
				default: 'key'
			},
			labelData: {
				type: Array,
				default: () => []
			},
			current: {
				type: Array,
				default: () => []
			},
			labelCount: {
				type: Number,
				default: 0
			}
		},
		methods: {
			itemClick(item, isExist) {
				this.$emit('itemClick', item, isExist)
			},
			getMore() {
				this.$emit('getMore')
			},
			collapse() {
				this.$emit('collapse')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.labelSelect {
		.labelSelect-item {

			padding: 12rpx;

			&.onlyRight {
				padding: 12rpx 12rpx 12rpx 0rpx;
			}

			&.onlyLeft {
				padding: 12rpx 0rpx 12rpx 12rpx;
			}

			.item-container {
				border-radius: 6rpx;
				padding: 18rpx 10rpx;
				color: $common-color-3;
				border: 1px solid $common-border-color-3;

				&.active {
					color: #FFFFFF;
					background-color: $common-blue-2;
					border: 1px solid $common-blue-2;
				}


			}
		}
	}
</style>
