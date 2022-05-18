<template>
	<Card class="summaryTitle" titleWeight="normal" titleMargin="20" :paddingBottom="true"
		:card-title="!isLoading && summaryData.deptName || '-'">
		<template v-if="!isLoading">
			<view class="summaryTitle-content u-flex" v-if="summaryData">
				<view class="content-item" :style="{width:'33%',textAlign:'center'}" v-for="(item,index) in fieldData"
					:key="index">
					<view class="">{{item.keyName ? item.keyName: fieldBigData.getFieldAttribute(item.key,'name')}}
					</view>
					<view class="">{{fieldBigData.format(item.key,summaryData[item.key],{isNeedUnit:true})}}</view>
				</view>

			</view>
			<page-empty v-else emptyType="miniCard"></page-empty>

		</template>


		<view class="card-loading" v-else>
			<u-loading class="box-loading" size="90" mode="circle"></u-loading>
		</view>
	</Card>
</template>

<script>
	import Card from '@/components/Card/Card.vue'
	import apiConfig from '@/config/apiConfig.js'
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	export default {
		components: {
			Card
		},
		props: {
			api: {
				type: String,
				default () {
					return ''
				}
			},
			fieldData: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				summaryData: null,
				fieldBigData,
				isLoading: true
			}
		},
		mounted() {
			uni.$on('contentFilter', (filter) => {
				this.getSummaryData(filter)
			});
			this.getSummaryData(getApp().globalData.filter)

		},
		destroyed() {
			uni.$off('contentFilter');
		},
		methods: {
			getSummaryData(filter) {
				this.isLoading = true
				this.$requestData(apiConfig.dashBoard[this.api], filter).then((res) => {
					this.summaryData = res.data;
					this.isLoading = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.summaryTitle {
		display: flex;
		margin-bottom: 20rpx;

		.card-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 300rpx;
		}

		.summaryTitle-content {
			align-items: flex-end;

			.content-left {
				height: 100%;
				display: flex;
				flex-direction: column-reverse;

				margin-right: 10rpx;

				.left-title {
					color: $common-color-3;
				}
			}

			.content-main {
				.main-header {
					.header-item {
						text-align: center;
						color: $common-color-3
					}
				}

				.main-data {
					.content-item {
						text-align: center;

						.item-value {
							&.up {
								color: #14c4a2;
							}

							&.down {
								color: #ff6b5c
							}

							&.invariant {
								color: $common-grey-1;
							}
						}
					}

				}
			}
		}
	}
</style>
