<template>
	<view class="productPlan" :class="[isSubmit?'isSubmit':'']">
		<u-top-tips ref="uTips"></u-top-tips>
		<u-popup duration="200" v-model="modalShow" mode="bottom" border-radius="15" z-index="5" height="70%">
			<view class="productPlan-modal">
				<view class="modal-header u-flex u-row-between">
					<view class="header-left">
						（已加入发货）
					</view>
					<view class="header-right" @click="cleanProductList">
						<u-icon name="trash" color="#4D4D4D" size="28"></u-icon>
						<text class="right-text">清空</text>
					</view>
				</view>
				<PlanProductList disabled="true" :isSubmit="isSubmit" :productList="filterProductList"
					@setProductList="setProductList">
				</PlanProductList>
			</view>

		</u-popup>
		<template v-if="!isLoading && productInfo">
			<template v-if="isSubmit">
				<PlanDetail :planDetailList="productList" :total="productInfo.submitNum" :isToDetail="true"
					@toDetailPage="toHistoryPage"></PlanDetail>
			</template>
			<template v-else>
				<view class="productPlan-finishTime">
					<view class="finishTime-info" v-if="isSubmit">
						发货总数：<view class="info-detail">{{productInfo.submitNum || '-'}}</view>
					</view>
					<view class="finishTime-info" v-else>
						截止提交时间：<view class="info-detail">{{$util.getCommonTime(productInfo.submitPlanEndTime,'-')}}
						</view>
					</view>
					<view class="finishTime-link" @click="toHistoryPage">历史计划<image class="link-arrow" :src="arrowSrc">
						</image>
					</view>

				</view>

				<PlanProductList :isSubmit="isSubmit" :productList="productList" @setProductList="setProductList">
				</PlanProductList>
			</template>

		</template>
		<EmptyPage emptyText="暂无发货计划" v-else-if="!isLoading"></EmptyPage>
		<!-- 如果沒有提交则显示按钮 -->
		<fixed-btn v-if="!isSubmit">
			<PlanButton :style="{width:'100%'}" slot="right-button" :targetPrice="productInfo.planMinAmount"
				:productList="productList" @showModal="showModal" @submit="submit"></PlanButton>
		</fixed-btn>
	</view>
</template>

<script>
	import SearchInput from '@/components/SearchInput/SearchInput.vue'
	import tabMixin from '@/mixins/tabMixin.js'
	import apiConfig from '@/config/apiConfig.js'
	import PlanProductList from '@/pages/product/components/PlanProductList.vue'
	import PlanButton from '@/pages/product/components/PlanButton.vue'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	import PlanDetail from "@/pages/product/components/PlanDetail.vue"
	export default {
		mixins: [tabMixin],
		components: {
			EmptyPage,
			SearchInput,
			PlanProductList,
			PlanButton,
			PlanDetail
		},
		mounted() {
			// this._tabComReachBottom_on_mixins(() => this.getPlanListItem())
			this._tabComShow_on_mixins(() => {
				this.getPlanListItem();
				// this.checkPlanIsSubmit();
			})
		},
		destroyed() {

			// 取消reachBottom的监听以及页面show的监听
			this._tabComHide_off_mixins()
			// this._tabComReachBottom_off_mixins();
			this._tabComShow_off_mixins()
		},
		data() {
			return {
				arrowSrc: `${this.$global.staticAddress}/image/arrow_report.png`,
				isSubmit: true,
				productInfo: null,
				productList: [],
				modalShow: false,
				// isCanUpdate: true,
				pageParams: {
					pageNum: 1,
					pageSize: 50
				},
				isLoading: true
			}
		},
		computed: {
			// 显示在购物车的商品
			filterProductList() {
				return this.productList.map((item) => ({
					...item,
					show: item.productNum > 0
				}))
			},
			// 是否有商品在购物车
			isHasItemInProduct() {
				let isOwnNumIndex = this.productList.findIndex(item => item.productNum > 0)
				return isOwnNumIndex >= 0;
			}
		},
		methods: {
			cleanLocalData() {
				uni.removeStorageSync('productInfo')
			},

			// 提交计划
			submitPlanListItem() {
				uni.showLoading({
					title: '计划提交中...'
				})
				const {

					staffId
				} = uni.getStorageSync('userInfo')
				const {
					deptId,
					id,
					planName
				} = this.productInfo
				const params = {
					planId: id,
					planName,
					staffId,
					deptId,
					deliverPlanStaffProductQos: this.productList.filter(item => {
						return item.productNum > 0
					})
				}
				this.$requestData(apiConfig.submitPlanListItem, params).then(res => {
					uni.hideLoading()
					this.$refs.uTips.show({
						title: '发货计划提交成功',
						type: 'success',
						duration: '2300'
					})
					this.cleanLocalData()
					this.getPlanListItem()

				})
			},
			checkPlanIsSubmit(params) {
				return this.$requestData(apiConfig.checkPlanIsSubmit, {
					...params,
					pageNo: 1,
					pageSize: 50
				}).then((res) => {
					let {
						data
					} = res;
					if (!data) {
						return {
							isSubmit: false,
							...data
						}
					}
					return {
						isSubmit: true,
						...data
					}
				})
			},
			//檢查计划是否更新
			checkPlanIsChange(data) {
				const {
					id: planId
				} = data
				if (uni.getStorageSync('productInfo')) {
					const {
						id: localPlanId
					} = uni.getStorageSync('productInfo')
					// 判断前后id是否一样
					if (localPlanId !== planId) {
						this.cleanLocalData()
					}
				}
			},
			getPlanListItem() {
				this.isLoading = true
				uni.showLoading({
					title: '数据加载中'
				})
				const {
					deptId,
					staffId
				} = uni.getStorageSync("userInfo")
				// 获取当前部门的发货计划
				this.$requestData(apiConfig.getPlanListItem, {
					deptId,
					...this.pageParams
				}).then((res) => {
					let {
						data
					} = res
					if (!data) {
						uni.hideLoading()
						this.cleanLocalData()
						this.isLoading = false
						return;
					}
					let {
						id: planId
					} = data
					this.checkPlanIsChange(data)
					// 检查是否已经提交 对数据再次封装
					this.checkPlanIsSubmit({
						planId,
						staffId
					}).then((customData) => {
						uni.hideLoading()
						this.isLoading = false
						const {
							isSubmit
						} = customData
						this.isSubmit = isSubmit;
						if (isSubmit) {
							this.setSubmitData(customData)
							// this.productInfo = data;
							// console.log(isSubmit)
						} else {
							this.setNotSubmitData(data)
						}
					})
				})
			},

			setSubmitData(data) {
				this.productInfo = data
				this.productList = data && data.deliverPlanStaffProductVoIPage ?
					data.deliverPlanStaffProductVoIPage.records : []
			},
			setNotSubmitData(data) {
				// 如果有缓存
				this.productInfo = data;
				if (uni.getStorageSync('productInfo') && uni.getStorageSync('productInfo').productList.length > 0) {
					this.productList = uni.getStorageSync('productInfo').productList
				} else {
					this.productList = data && data.deliverPlanProductSimpleVos ?
						data.deliverPlanProductSimpleVos.records.map(
							item =>
							({
								...item,
								productNum: 0
							})) : []
				}
			},
			setLocalProductList() {

				if (this.isHasItemInProduct) {
					let {
						id
					} = this.productInfo;
					// 由于接口字段不统一只能前端再次封装同一字段回显
					uni.setStorageSync('productInfo', {
						id,
						productList: this.productList
					})
					return;
				}
				uni.setStorageSync('productInfo', null)

			},
			setProductList(data) {
				const {
					value,
					index
				} = data
				this.productList[index].productNum = value;
				this.setLocalProductList()
			},
			cleanProductList() {
				this.productList = this.productList.map(item => ({
					...item,
					productNum: 0
				}))
				this.setLocalProductList()
			},
			showModal() {
				if (this.isHasItemInProduct) {
					this.modalShow = true
				} else {
					this.$util.showToast({
						title: '请选择需要发货的商品',
						icon: 'none'
					})
				}
			},
			submit() {
				// console.log('submit')
				this.modalShow = false
				this.submitPlanListItem()
			},
			toHistoryPage() {
				const {
					id
				} = this.productInfo
				uni.navigateTo({
					url: `/pages/product/productPlanHistory?planId=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.productPlan {
		padding-top: 20rpx;
		padding-bottom: 150rpx;
		flex: 1;
		height: 100%;

		&.isSubmit {
			padding-bottom: 0rpx;
		}
	}

	.productPlan-finishTime {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		background-color: $common-blue-3;

		.finishTime-info {
			display: flex;
			color: $common-color-1;

			.info-detail {
				color: $common-red-1;
			}
		}

		.finishTime-link {
			color: $common-blue-2;

			.link-arrow {
				margin-left: 12rpx;
				width: 20rpx;
				height: 20rpx;
			}
		}


	}

	.productPlan-modal {
		padding-bottom: 150rpx;
		position: relative;
		padding-top: 100rpx;

		.modal-header {
			background-color: #FFFFFF;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			padding: 30rpx 30rpx 30rpx 30rpx;
			z-index: 10;

			.header-right {
				.right-text {
					color: $common-grey-1;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
