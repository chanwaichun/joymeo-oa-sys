<template>
	<Card class="rankCard u-flex" titleWeight="normal" :titleMargin="titleMargin" :paddingBottom="true"
		:card-title="cardTitle">
		<u-modal v-model="tipsShow" :content="fieldDescription"></u-modal>

		<view slot="titleIcon">
			<view v-if="showSort" class="time-desc" @click="setDesc">
				<image v-if="params.desc" class="desc-icon"
					src="https://static.joymeohis.com/wx/gongzonghao/image/direction_down.png">
				</image>
				<image v-else class="desc-icon"
					src="https://static.joymeohis.com/wx/gongzonghao/image/direction_up.png">
				</image>
				<!-- 	{{params.desc?'升序':'降序'}} -->
			</view>
		</view>
		<view v-if="cardTips" class="rankCard-cardTips">{{cardTips}}</view>
		<template v-if="!isLoading">
			<DashBoardTime v-if="showTime"></DashBoardTime>
			<view class="rankCard-header u-flex" v-if="showHeader">
				<view class="header-item common-item-padding" :style="{width:`${Math.round(100/rankHeader.length)}%`}"
					v-for="(item,index) in rankHeader" :key="index" @click="showDescription(item)">

					{{item.keyName || fieldBigData.getFieldAttribute(item.key,'name')}}
					<u-icon v-if="item.showDescribe" name="question-circle-fill">
					</u-icon>


				</view>
			</view>
			<view class="rank" v-if="rankData.length > 0">

				<view class="rank-item" v-for="(item,index) in rankData" :key="index">
					<view class="item-describe">
						<view class="describe-rank">{{rankValue ? item[rankValue]:index+1}}</view>
						<view class="describe-name word-break-all common-item-padding"
							:style="{width:headerItem.width || `${Math.round(100/rankHeader.length)}%`,textAlign:headerItem.align || 'left'  }"
							v-for="(headerItem,headerIndex) in rankHeader" :key="headerIndex">
							<template v-if="headerItem.key === 'userName'">
								<view>{{item[headerItem.key]||'--'}}</view>
								<view v-if="headerItem.showDeptName">{{item.deptName || '--'}}</view>
								<view v-if="headerItem.showRoleName">{{item.roleName || '--'}}</view>
							</template>
							<!-- 如果是诊所名 -->
							<template v-else-if="headerItem.key === 'clinicName'">
								{{item[headerItem.key].length>20?`${item[headerItem.key].slice(0,20)}...`:item[headerItem.key]}}
							</template>
							<!-- 如果是环比 -->
							<template v-else-if="headerItem.isGrowth">
								<GrowthCom :iconShow="summaryData[`${item.key}Growth`]!==0" :propsKey="headerItem.key"
									:value="item[headerItem.key]"></GrowthCom>
							</template>
							<template v-else-if="headerItem.otherKey">
								<view>{{setValueByOptions(headerItem,item)}} {{item[headerItem.otherKey] || ''}}</view>
							</template>
							<!-- <template v-else-if="checkIsArray(headerItem.key)">
								<view>
									<text v-for="(itemKey,index) in headerItem.key" :key="index">
										{{setValueByOptions(headerItem,item[itemKey])}}
									</text>
								</view>

							</template> -->
							<template v-else>
								{{setValueByOptions(headerItem,item)}}
							</template>
						</view>
					</view>

				</view>
				<view v-if="isShowLoadButton" class="rank-load" @click="getMoreRank">点击加载更多</view>



			</view>
			<EmptyPage size="component" v-else></EmptyPage>
		</template>
		<view class="card-loading" v-else>
			<u-loading class="box-loading" size="90" mode="circle"></u-loading>
		</view>

	</Card>
</template>

<script>
	import apiConfig from '@/config/apiConfig.js';
	import fieldBigData from '@/fieldMap/fieldBigData.js'
	import tabMixin from '@/mixins/tabMixin.js'
	import Card from '@/components/Card/Card.vue'
	import util from '@/pagesB/dashBoard/utils/index.js'
	import GrowthCom from '@/components/GrowthCom/GrowthCom.vue'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	import DashBoardTime from './DashBoardTime.vue'
	export default {
		mixins: [tabMixin],
		components: {
			DashBoardTime,
			Card,
			EmptyPage,
			GrowthCom
		},
		props: {
			titleMargin: {
				type: Number,
				default: 20
			},
			fetchByPage: {
				type: Boolean,
				default: () => false
			},
			showHeader: {
				type: Boolean,
				default: false
			},
			showTime: {
				type: Boolean,
				default: true
			},
			showSort: {
				type: Boolean,
				default: true
			},
			rankHeader: {
				type: Array,
				default () {
					return []
				}
			},
			keyData: {
				type: Array,
				default () {
					return []
				}
			},
			cardTips: {
				type: String,
				default: ''
			},
			cardTitle: {
				type: String,
				default: '标题'
			},
			api: {
				type: String,
				default: ''
			},
			rankValue: {
				type: String,
				default: ''
			}

		},
		data() {
			return {

				fieldBigData,
				filter: getApp().globalData.filter,
				rankData: [],
				isLoading: true,
				rankAllData: [],
				yesterday: null,
				filterTime: null,
				isCanUpdate: true,
				params: {
					desc: true,
				},
				isShowLoadButton: false,
				tipsShow: false,
				fieldDescription: '',
			}
		},
		destroyed() {
			uni.$off('rankFilter');
			this.rankData = null;
			this._tabComReachBottom_off_mixins()
		},
		mounted() {

			uni.$on('rankFilter', (filter) => {
				this.rankData = [];
				this.pageParams.pageNum = 1;
				this.isCanUpdate = true;
				this.getRankData(filter)
			});
			this._tabComReachBottom_on_mixins(this.setRankByPageSize, this.fetchByPage)
			this.getRankData(getApp().globalData.filter)
		},
		methods: {
			checkIsArray(value) {
				debugger;
				return value instanceof Array
			},
			showDescription(item) {
				if (item.showDescribe) {
					this.fieldDescription = fieldBigData.getFieldAttribute(item.key, 'description')
					this.tipsShow = true;
				}
			},
			setValueByOptions(headerItem, item) {
				const {
					key,
					showNullBan
				} = headerItem
				return fieldBigData.format(key, item[key], {
					isNeedUnit: true
				})

			},
			getRankType() {
				return !this.params.desc ? 'desc' : 'asc'
			},
			getRankData(filter) {
				if (!this.fetchByPage || (this.fetchByPage && this.pageParams.pageNum === 1)) {
					this.isLoading = true;
				}
				this.$requestData(apiConfig.dashBoard[this.api], {
					...filter,
					...(this.fetchByPage ? this.pageParams : {}),
					rankType: this.fetchByPage ? this.getRankType() : ''
				}).then((res) => {
					this.isLoading = false;
					if (this.fetchByPage) {
						uni.hideLoading()
						this.rankData = [...this.rankData, ...res.data.records]
						if (res.data.records.length < 20) {
							this.isCanUpdate = false
						}
						return;
					}
					// this.filterTime = util.setFilterTime(filter);
					this.setRankByDesc(res.data);
					this.setRankByPageSize();


				})
			},
			getMoreRank() {
				if (this.fetchByPage) return;

				this.pageParams.pageNum += 1;
				this.setRankByPageSize()
			},
			setDesc() {
				if (this.isLoading) return;
				if (this.fetchByPage) {
					this.rankData = []
					this.isCanUpdate = true;
					this.params.desc = !this.params.desc;
					this.pageParams.pageNum = 1;
					this.getRankData(getApp().globalData.filter)
					return;
				}
				this.params.desc = !this.params.desc;
				this.setRankByDesc(this.rankAllData)
				this.setRankByPageSize()
			},
			// 前端排序
			setRankByDesc(data) {
				this.rankAllData = data.sort((a, b) => {
					if (this.params.desc) {
						return a[this.rankValue] - b[this.rankValue]

					} else {
						return b[this.rankValue] - a[this.rankValue]
					}

				})
			},
			// 前端根据
			setRankByPageSize() {
				if (this.isLoading) return;
				if (this.fetchByPage && !this.isLoading) {
					uni.showLoading({
						title: '数据加载中'
					})
					this.pageParams.pageNum += 1;
					this.getRankData(getApp().globalData.filter)
					return;
				}
				this.rankData = this.rankAllData.slice(0, this.pageParams.pageNum * this.pageParams.pageSize)
				if (this.rankData.length < this.rankAllData.length) {
					this.isShowLoadButton = true
				} else {
					this.isShowLoadButton = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.time-desc {
		margin-left: 30rpx;
		margin-top: 10rpx;
		color: #4975C0;

		.desc-icon {
			width: 35rpx;
			height: 35rpx;
		}
	}

	.common-item-padding {
		padding: 0rpx 8rpx;
	}

	.rankCard {
		margin-bottom: 20rpx;

		.rankCard-time {
			margin-bottom: 32rpx;

			.time-range {
				font-size: 24rpx;
				color: $common-grey-1;
				margin-right: 10rpx;

			}

			.time-key {
				font-size: 24rpx;
				color: #0D0D0D;
				margin-left: 10rpx;

			}


		}

		.rankCard-cardTips {
			font-size: 28rpx;
			color: $common-grey-1;
			margin-bottom: 16rpx;
		}

		.rankCard-header {
			padding-left: 40rpx;
		}

		.rank {
			.rank-item {

				.item-describe {
					font-size: 28rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 36rpx 0rpx;
					border-bottom: 1px solid #F0F0F0;
					color: #1A1A1A;

					.describe-rank {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						background-color: #E6E6E6;
						line-height: 40rpx;
						text-align: center;
						font-size: 24rpx;
					}

					// .item-describe-name {

					// 	font-size: 32rpx;

					// 	.name-rankTop,
					// 	.name-rank {
					// 		width: 40rpx;
					// 		height: 40rpx;
					// 		margin-right: 20rpx;

					// 	}



					// 	.name-dept {
					// 		margin-left: 10rpx;
					// 	}
					// }

					// .item-describe-money {
					// 	font-size: 24rpx;
					// 	font-weight: bold;
					// }
				}
			}

			.rank-load {
				margin-top: 20rpx;
				width: 100%;
				text-align: center;
			}
		}

		.card-loading {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 700rpx;
		}
	}
</style>
