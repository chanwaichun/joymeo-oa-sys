<template>
	<view class="accessReport u-flex-col">
		<u-modal v-model="modalShow" content="提交考核方案后无法修改，请确认填写无误" @confirm="modalConfirm('modal')"
			:show-cancel-button="true" cancel-text="取消"></u-modal>
		<u-modal v-model="thanksModalShow" content="提交完成，感谢你的填写" @confirm="modalConfirm('thanksModal')"></u-modal>
		<u-modal v-model="errMsgModalShow" :content="errMsg" @confirm="modalConfirm('thanksModal')"></u-modal>
		<view class="accessReport-header u-flex-col u-row-center u-col-center"
			v-if="!isLoading && productDraftList && !isSubmit">
			<view class="header-time">
				<text class="time-key">截止上报时间：</text>
				<text class="time-value">{{this.$util.getCommonTime(productTotalDetail.collectEndDate,'-')}}</text>
			</view>
			<view class="header-time word-break-all word-nowrap">
				<text class="time-key">考核时间：</text>
				<text class="time-value">{{rangeTime()}}</text>
			</view>
		</view>
		<view class="accessReport-header u-flex " v-else-if="!isLoading && productDraftList && isSubmit">
			<view class="header-num">本月盒数：<text class="num-value">{{currentMonthAllBoxTotal || '-'}}</text></view>
			<view class="header-num">总盒数：<text class="num-value">{{productTotalDetail.listBoxTotal}}</text></view>
		</view>
		<PlanListCom :data="productDraftList" @setCurrent="setCurrent" :isSubmit="isSubmit"></PlanListCom>
		<BottomBannerCom v-if="productDraftList&&!isSubmit" :boxTotal="productTotalDetail.listBoxTotal"
			@submit="submit">
		</BottomBannerCom>
	</view>
</template>

<script>
	import PlanListCom from '@/pages/access/components/PlanListCom.vue'
	import tabMixin from "@/mixins/tabMixin.js";
	import BottomBannerCom from '@/pages/access/components/BottomBannerCom.vue'
	import apiConfig from '@/config/apiConfig.js'
	export default {
		mixins: [tabMixin],
		components: {
			PlanListCom,
			BottomBannerCom
		},
		data() {
			return {
				currentMonthAllBoxTotal: null,
				showCloseModal: false,
				thanksModalShow: false,
				errMsgModalShow: false,
				errMsg: '',
				modalShow: false,
				productDraftList: null,
				productTotalDetail: {},
				isSubmit: true,
				isLoading: true
			}
		},
		mounted() {
			this._tabComShow_on_mixins(()=>{
				this.getAccessList()
			})
		},
		destroyed() {
			this._tabComShow_off_mixins()
		},
		methods: {
			rangeTime() {
				return `${this.$util.getCommonTime(this.productTotalDetail.startDate,'-')} ~ ${this.$util.getCommonTime(this.productTotalDetail.endDate,'-')}`;
			},
			getAccessList() {
				this.isLoading = true
				uni.showLoading({
					title: '加载中...'
				})
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.getAccessList, {
					staffId,
				}).then((res) => {
					this.isLoading = false
					uni.hideLoading()
					const {
						productDraftList
					} = res.data;

					this.isSubmit = productDraftList ? productDraftList[0].isSubmit : true
					this.currentMonthAllBoxTotal = productDraftList.reduce((prev, current) => {
						return prev + current.monthBoxTotal
					}, 0)
					// this.isSubmit = true
					this.productDraftList = productDraftList;
					this.productTotalDetail = res.data;
				}).catch(() => {
					this.isLoading = false
				})
			},
			saveAccessPlan() {
				uni.showLoading({
					title: '提交中'
				})
				const {
					staffId,
				} = uni.getStorageSync('userInfo')
				const {
					planId
				} = this.productTotalDetail
				this.$requestData(apiConfig.saveAccessPlan, {
						staffId,
						planId
					}, {
						isNotNeedMsg: true
					}).then((res) => {
						this.getAccessList()
						this.thanksModalShow = true
					})
					.catch((err) => {
						this.errMsg = err;
						this.errMsgModalShow = true
					})
			},
			modalConfirm(type) {
				if (type === 'modal') {
					this.saveAccessPlan()
					// this.thanksModalShow = true
					// this.getAccessList()
				}
			},
			submit() {

				let index = this.productDraftList.findIndex((item, index) => {
					return item.isRequired && item.boxTotal === 0
				})
				if (index <= -1) {
					this.modalShow = true
				} else {
					this.$util.showToast({
						title: '存在必填考核产品总盒数为0，请补充必填考核产品盒数。',
						icon: 'none'
					})
				}

			},
			setCurrent(currentIndex) {
				this.$emit('setCurrent', currentIndex)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.accessReport {
		background-color: #F7F7F7;

		.accessReport-header {
			width: 100%;
			background-color: #e5efff;
			padding: 26rpx 20rpx;

			.header-num {
				font-size: 30rpx;
				color: #000000;

				.num-value {
					color: #1D4393
				}

				&:first-child {
					margin-right: 46rpx;
				}
			}

			.header-time {
				margin-bottom: 24rpx;
				font-size: 24rpx;

				.time-key {
					color: #000000;
				}

				.time-value {
					color: #4d78c1;
				}

				&:last-child {
					margin-bottom: 0rpx;
				}
			}
		}




	}
</style>
