<template>
	<uni-popup ref="popup" type="bottom" @change="popupChange">
		<view class="commonCascader">
			<view class="filterTitle">{{title}}</view>
			<view class="filterView">

				<view class="group" v-for="(wrapItem, wrapIdx) of wrapContent" :style="groupStyle">
					<scroll-view class="filter-content-scroll" scroll-y enhanced show-scrollbar>
						<view class="cell" :class="{active: item[valueKey] === values[wrapIdx]}"
							v-for="(item, i) of wrapItem" :key="i" @click="itemClick(wrapIdx,i)">
							<text>{{item[labelKey]}}</text>
						</view>
					</scroll-view>
				</view>

			</view>
			<view class="filterBtns">
				<button class="reset" @tap="reset">重置</button>
				<button class="confirm" @tap="confirm">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import UniPopup from "./uni-popup/uni-popup.vue";
	const DEFAULT_FIELDS = {
		label: "label",
		value: "value",
		children: "children",
	};
	export default {
		name: "CommonCascader",
		components: {
			UniPopup,
		},
		props: {
			value: {
				type: Boolean,
				required: true,
			},
			options: {
				type: Array,
				required: true,
			},
			fieldNames: {
				type: Object,
				default: () => DEFAULT_FIELDS,
			},
			isFullValue: {
				type: Boolean,
				default: false,
			},
			defaultSelected: {
				type: Array,
			},
			title: {
				type: String,
				default: "请选择",
			},
			height: {
				type: String,
			},
		},
		data() {
			return {
				wrapContent: [this.options],
				values: [],
				wrapperHeight: 0,
			};
		},
		watch: {
			options(n) {
				this.wrapContent = [n];
			},
			value: {
				handler(n) {
					this.$nextTick(() =>
						n ? this.$refs.popup.open() : this.$refs.popup.close()
					);
				},
				immediate: true,
			},
		},
		computed: {
			groupStyle() {
				return 'width:' + 100 / this.wrapContent.length + '%;'
				// return "width:300rpx";
			},
			labelKey() {
				return this.fieldNames.label || DEFAULT_FIELDS.label;
			},
			valueKey() {
				return this.fieldNames.value || DEFAULT_FIELDS.value;
			},
			childrenKey() {
				return this.fieldNames.children || DEFAULT_FIELDS.children;
			},
		},
		created() {
			const systemInfo = uni.getSystemInfoSync();
			this.wrapperHeight = systemInfo.windowHeight + "px";
		},
		mounted() {
			this.initDefaultSelected();
		},
		methods: {
			initDefaultSelected(idx = 0) {
				if (this.defaultSelected?.length) {
					this.wrapContent[idx].forEach((v, i) => {
						if (this.defaultSelected.includes(v.value) && v.children?.length) {
							this.wrapContent[++idx] = v.children;
							this.initDefaultSelected(idx);
						}
					});
					this.values = [...this.defaultSelected];
				}
			},
			itemClick(wrapIdx, i) {
				console.log(this.wrapContent);
				this.values[wrapIdx] = this.wrapContent[wrapIdx][i][this.valueKey];
				this.values = this.values.slice(0, wrapIdx + 1);
				let children = this.wrapContent[wrapIdx][i][this.childrenKey];
				if (children?.length) {
					this.wrapContent[++wrapIdx] = children;
					this.wrapContent = this.wrapContent.slice(0, wrapIdx + 1);
					if (this.isFullValue) {
						this.$nextTick(() => {
							this.itemClick(wrapIdx, 0);
						});
					}
				} else this.wrapContent = this.wrapContent.slice(0, wrapIdx + 1);
				this.$nextTick(function() {
					this.$emit("change", this.values);
				});
			},
			confirm() {
				if (this.isFullValue) {
					if (this.values.length && this.values.length != this.wrapContent.length)
						return console.log("未选择完整");
				}
				this.$emit("input", false);
				this.$emit("confirm", this.values);
			},
			reset() {
				if (this.wrapContent.length) {
					this.values = [];
					this.wrapContent = [this.wrapContent[0]];
				}
			},
			popupChange(e) {
				this.$emit("input", e.show);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.commonCascader {
		height: 70vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background-color: #fff;

		.filterTitle {
			text-align: center;
			padding: 20rpx;
		}

		.filterView {
			height: 70%;
			flex: 1;
			display: flex;
			width: 100%;

			.group {
				border-left: 1px solid #eee;

				.filter-content-scroll {
					height: 100%;
				}

				.cell {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					padding: 20rpx 28rpx;
					box-sizing: border-box;
					position: relative;

					&.active {
						background-color: rgba($uni-color-primary, 0.05);

						&::before {
							content: "";
							position: absolute;
							left: 0;
							top: 2rpx;
							width: 6rpx;
							height: 100%;
							background-color: $uni-color-primary;
						}
					}
				}
			}
		}

		.filterBtns {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			padding-bottom: env(safe-area-inset-bottom);
			border-top: 1px solid #eff0f1;

			button {
				font-size: 32rpx;
				height: 80rpx;
				margin: 0;

				&.cancel {
					width: calc((100% - 40rpx) / 3);
					background-color: #eff0f1;
					border-color: #eff0f1;
				}

				&.confirm {
					background-color: $uni-color-primary;
					color: #fff;
					width: calc((100% - 40rpx) * 2 / 3 + 20rpx);
				}

				&.reset {
					margin-right: 30rpx;
					flex: 1;
				}
			}
		}
	}
</style>
