<template>
	<view class="accessAim">

		<u-card margin="0 0 20rpx 0" :border="false" padding="0" :footBorderTop="false">
			<view slot="body">
				<swiper class="swiper-container" :autoplay="false" interval="5000" :circular="true"
					indicator-dots="true" key="swiper" indicator-color="#FFFFFF" indicator-active-color="#4975C0"
					style="height: 340rpx">
					<swiper-item v-for="(item,index) in bannerData" :key="index">
						<view class="swiper-item u-flex u-row-between" :key="index">
							<ProgressBar :textColor="setTextColorByRate(item.doneRate)"
								:mainColor="setColorByRate(item.doneRate)" backgroundColor="#FFFFFF"
								backgroundImage="https://static.joymeohis.com/wx/gongzonghao/image/swiper_bg.png"
								:rate="item.doneRate"
								:circleBottomText="fieldMap.getFieldAttribute(item.timeSpan,'name',true)+'进度'">
							</ProgressBar>
							<view class="item-describe">
								<view>
									<view class="item-describe-text">
										目标{{fieldMap.getFieldAttribute(item.quotaCategory,'name')}}</view>
									<view class="item-describe-number">
										{{fieldMap.getFieldAttribute(item.quotaCategory,'unit',true)}}{{item.targetKpi ===null || isNaN(Number(item.targetKpi)) ? '-':item.targetKpi}}
									</view>
								</view>
								<view>
									<view class="item-describe-text">
										实际{{fieldMap.getFieldAttribute(item.quotaCategory,'name')}}</view>
									<view class="item-describe-number">
										{{fieldMap.getFieldAttribute(item.quotaCategory,'unit',true)}}{{item.doneKpi||'0'}}
									</view>
								</view>

							</view>
						</view>
					</swiper-item>

				</swiper>
			</view>

		</u-card>
		<u-card margin="0 0 20rpx 0" :border="false" padding="0" cardPadding="20rpx" :footBorderTop="false">
			<view slot="head">
				<view class="card-title">
					<view class="card-title-text">目标</view>

				</view>

			</view>
			<view slot="body">
				<view class="card-body u-flex u-row-around">
					<view v-for="(item,index) in bannerData" class="body-item" :key="index">
						<view class="body-item-num">
							<text
								class="num-active">{{setValueByUnit('doneKpi',item.doneKpi)}}</text>/{{setValueByUnit('targetKpi',item.targetKpi)}}
						</view>
						<view class="body-item-describe">
							{{fieldMap.getFieldAttribute(item.timeSpan,'name',true)}}{{fieldMap.getFieldAttribute(item.quotaCategory,'name')}}
						</view>
					</view>

				</view>
				<ProductList :data="productData"></ProductList>

			</view>
		</u-card>
		<u-card margin="0" :border="false" cardPadding="20rpx" padding="0" :footBorderTop="false">
			<view slot="head">
				<view class="card-title">
					<view class="card-title-text">销售简报</view>
					<CapsuleTab :tabList="capsuleList" @capsuleClick="capsuleClick"></CapsuleTab>
				</view>

			</view>
			<view slot="body">
				<view class="saleInfo-body">
					<view v-for="(key,index) of Object.keys(saleInfo)" :key="index" class="saleInfo-item">
						<view class="saleInfo-item-key">{{fieldMap.getFieldAttribute(key,'name')}}</view>
						<text class="saleInfo-item-value">
							{{setValueByUnit('doneKpi', saleInfo[key])}}
						</text>
					</view>
				</view>

			</view>
		</u-card>


	</view>
</template>

<script>
	import fieldMap from '@/fieldMap/fieldNormal.js'
	import apiConfig from '@/config/apiConfig.js'
	import CapsuleTab from '@/components/CapsuleTab/CapsuleTab.vue'
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	import ProductList from '@/pages/access/components/ProductList.vue'
	import tabMixin from '@/mixins/tabMixin.js'
	export default {
		mixins: [tabMixin],
		components: {
			ProgressBar,
			ProductList
		},
		mounted() {
			this._tabComShow_on_mixins(() => {
				this.getDataByCurrent()
			})
		},
		destroyed() {
			this._tabComShow_off_mixins()
		},
		data() {
			return {
				isCanUpdate: false,
				bannerData: [],
				productData: [],
				saleInfo: {},
				fieldMap,
				current: 0,
				capsuleList: [{
					value: 'DAY',
					text: '今天'
				}, {
					value: 'WEEK',
					text: '本周'
				}, {
					value: 'MONTH',
					text: '本月'
				}],
			}
		},
		methods: {
			setValueByUnit(target, value) {
				let newValue
				let translateTarget = ['doneKpi', 'doneBoxNum']
				if (value === null) {
					newValue = translateTarget.includes(target) ? 0 : '-'
				} else {
					newValue = this.$util.setPriceAbridge(value);
				}
				return newValue

			},
			setProductData(data) {
				let productData = []
				// 遍历数据
				data.forEach(item => {
					// 如果其中的quotaCategory类别等于SALES_NUM销售量
					if (item.quotaCategory === 'SALES_NUM') {
						productData = [...productData, ...item.productVoList]
					}
				})
				this.productData = productData
			},
			capsuleClick(item, index) {
				const {
					value
				} = item;
				this.getSaleInfo({
					queryType: value
				})
			},
			getDataByCurrent() {
				this.current = 0;
				this.getBannerData()
				this.getSaleInfo({
					queryType: this.capsuleList[0].value
				})
			},
			setColorByRate(rate) {
				return rate < 50 ? "#F6544D" : "#4E7CCC"
			},
			setTextColorByRate(rate) {
				return rate < 50 ? "#F9766C" : "#4975C0"
			},
			// 把有指标的放前面
			sortBannerData(data) {
				let newData = []
				let isNullData = data.filter(item => {
					if (!item.isNull) {
						newData.push(item)
					}
					return item.isNull === true;
				})
				return [...newData, ...isNullData]
			},
			// 获取轮播图中的数据
			getBannerData() {
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.getBannerData, {
					staffId
				}).then((res) => {
					this.bannerData = this.sortBannerData(res.data);
					this.setProductData(res.data)
				})
			},
			// 获取销售信息
			getSaleInfo(params) {
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.getSaleInfo, {
					staffId,
					...params
				}).then((res) => {
					const {
						doneTask,
						nowSalesMoney,
						addMemberNum,
						visitCustomers,
						signInDays
					} = res.data
					this.saleInfo = {
						addMemberNum,
						visitCustomers,
						signInDays,
						nowSalesMoney
					}
				})
			},

		},
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.accessAim {

		min-height: 100vh;
		flex: 1;
		padding: 32rpx;
		background-color: #4975C0;

		.swiper-container {
			overflow: hidden;
			background-color: #FFFFFF;
			background-image: url('https://static.joymeohis.com/wx/gongzonghao/image/swiper_bg.png');
			background-size: 100% 100%;

			.swiper-item {
				padding: 40rpx 70rpx;
				display: flex;
				position: static;


				.item-describe {
					color: #ffffff;
					width: 50%;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 20rpx 0rpx 40rpx 40rpx;

					.item-describe-text {
						color: $common-blue-2;
						font-size: 28rpx;
						margin-bottom: 20rpx;
					}

					.item-describe-number {
						font-weight: bold;
						color: $common-color-1;
						font-size: 30rpx;
					}

				}

			}

		}

		.card-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;

			.card-title-text {
				font-weight: bold;
				font-size: 32rpx;
			}
		}

		.card-body {
			justify-content: space-around;
			padding-top: 40rpx;
			text-align: center;

			.body-item-num {
				font-size: 36rpx;
				font-weight: bold;
				margin-bottom: 24rpx;

				color: $common-color-4;

				.num-active {
					color: $common-blue-1;
				}
			}

			.body-item-describe {

				color: $common-color-3;
				font-size: 24rpx;
			}
		}


		.saleInfo-body {
			display: flex;
			flex-wrap: wrap;
			padding-top: 20rpx;

			.saleInfo-item {
				width: 25%;
				text-align: center;

				.saleInfo-item-key {
					font-size: 28rpx;
					margin-bottom: 30rpx;
					color: $common-color-3;
				}

				.saleInfo-item-value {
					font-size: 40rpx;
					font-weight: bold;
					color: $common-color-1;
				}
			}
		}
	}
</style>
