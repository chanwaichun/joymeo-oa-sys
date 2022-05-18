<template>
	<view class="workAccessEdit u-flex-col" :class="[isSubmit?'isSubmit':'']">
		<DetailCardCom :data="planDetail">
		</DetailCardCom>
		<view class="workAccessEdit-form">
			<view class="form-header u-flex" v-if="!isSubmit">
				<text class="header-text">目标总数量</text>
				<view class="u-flex u-flex-1">
					<u-input class="u-flex-1" :clearable="false" type="number" :custom-style="inputStyle"
						v-model="boxNumber" maxlength="7" placeholder="请输入数值" />
					<u-button slot="right-button" size="mini" type="primary" shape="circle" @click="equalDivide">平均分配
					</u-button>
				</view>

			</view>
			<u-form :model="form" ref="uForm" label-width="200">
				<u-form-item :label-style="labelStyle" :borderBottom="false" :label="item.monthTxt"
					:prop="`${item.monthTxt}`" v-for="(item,index) in detailList">
					<u-input :disabled="isSubmit" type="number" :custom-style="inputStyle" v-model="form[item.monthTxt]"
						maxlength="7" placeholder="请输入数值" />
				</u-form-item>
			</u-form>
		</view>
		<fixed-btn v-if="!isSubmit">
			<u-button slot="right-button" style="width: 100%;" type="primary" shape="circle" @click="onSubmit">保存
			</u-button>
		</fixed-btn>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import apiConfig from '@/config/apiConfig.js'
	import formMixin from '@/mixins/formMixin.js'
	import DetailCardCom from './components/DetailCardCom.vue'
	import BottomBannerCom from './components/BottomBannerCom.vue'
	export default {
		mixins: [formMixin],
		data() {
			return {
				rules: null,
				form: {},
				planDetail: {},
				detailList: [],
				boxNumber: '',
				// 组件样式
				labelStyle: {
					color: '#000000'
				},
				inputStyle: {
					padding: '10rpx 0rpx',
					borderBottom: '1px solid #F0F0F0'
				},
				isSubmit: true,

			};
		},
		components: {
			DetailCardCom,
			BottomBannerCom
		},

		onShow() {
			this.urlParams = util.getUrlParams()
			this.isSubmit = Boolean(Number(this.urlParams.isSubmit))
			this.getDraftDetail()
		},
		methods: {
			// inputStyle(boolean) {
			// 	let obj = {
			// 		padding: '10rpx 0rpx'
			// 	}
			// 	if (boolean) {
			// 		obj.borderBottom = '1px solid #F0F0F0'
			// 	}
			// 	return obj
			// },
			// 生成动态表单验证
			setRulesByData(data) {
				let rules = {}
				this.detailList.forEach((item, index) => {
					rules[item.monthTxt] = [{
						validator: (rule, value, callback) => {
							const newValue = this.form[item.monthTxt]
							if (newValue === '') {
								return true
							} else {
								return Number(newValue) <= 999999 && Number(newValue) >= 0 && this
									.$util
									.checkInteger(newValue)
							}

						},
						message: '请输入0到999999以内的整数',
						trigger: ['change'],
					}]
				})
				return rules
			},
			setDetailQoList(form) {
				return Object.keys(form).map(key => {
					return {
						monthTxt: key,
						boxNum: Number(form[key] || 0)
					}
				})
			},
			equalDivide() {
				if (this.boxNumber === '') {
					this.$util.showToast({
						title: '请输入需要分配的数值',
						icon: 'none'
					})
				} else if (this.boxNumber.includes('.')) {
					this.$util.showToast({
						title: '目标总数量不能为小数，请输入整数',
						icon: 'none'
					})

				} else if (this.$util.checkInteger(this.boxNumber)) {
					// 考核的月份数量
					let month = this.detailList.length
					this.form = this.divideFormat(Number(this.boxNumber), month)
					// 重新校验表单，该函数消除遗留的错误信息（form表单bug，数据变化以后没有重新校验）
					this.$refs.uForm.validate()

				} else {
					this.$util.showToast({
						title: '请输入整数',
						icon: 'none'
					})
				}


			},
			resetForm() {
				let obj = {}
				this.detailList.forEach((item, index) => {
					// 判断是否已经提交 提交以后回显0 不提交就回显空
					obj[item.monthTxt] = this.isSubmit ? (item.boxNum || 0) : (item.boxNum || '')
				})
				return obj
			},
			divideFormat(total, month) {
				let obj = {}
				// 当数量大于月份的时候
				if (total > month) {
					let normalEqualNumber = Math.floor(total / month);
					let lastEqualNumber = total - (normalEqualNumber * (month - 1));
					this.detailList.forEach((item, index) => {
						obj[item.monthTxt] = index === this.detailList.length - 1 ? lastEqualNumber :
							normalEqualNumber
					})
				} else {
					this.detailList.forEach((item, index) => {
						obj[item.monthTxt] = index <= total - 1 ? 1 : 0
					})
				}
				return obj
			},
			getDraftDetail() {
				const {
					draftId
				} = this.urlParams
				this.$requestData(apiConfig.getDraftDetail, {
					draftId
				}).then((res) => {
					const {
						detailList,
						boxTotal
					} = res.data
					// 考核计划详情
					this.planDetail = res.data
					// 考核计划每个月的列表
					this.detailList = detailList
					// 药品盒数
					this.boxTotal = boxTotal || 0
					this.form = this.resetForm()
					this.rules = this.setRulesByData(detailList);
					this.$refs.uForm.setRules(this.rules)
				})
			},
			saveDraftDetail(detailQoList) {
				const {
					draftId
				} = this.urlParams
				uni.showLoading({
					title: '保存中...'
				})
				this.$requestData(apiConfig.saveDraftDetail, {
					draftId,
					detailQoList
				}).then(() => {
					this.$util.showToast({
						title: '保存草稿成功',
						success: () => {
							uni.navigateBack()
						}
					})
				})
			},
			formSubmit() {
				let detailQoList = this.setDetailQoList(this.form)
				let callback = () => this.saveDraftDetail(detailQoList)
				if (this.planDetail.isRequired) {
					let index = detailQoList.findIndex(item => item.boxNum > 0)
					if (index > -1) {
						callback()
					} else {
						this.$util.showToast({
							title: '存在必填考核产品总盒数为0，请补充必填考核产品盒数。',
							icon: 'none'
						})
					}
				} else {
					callback()
				}
			}
		}


	}
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.workAccessEdit {
		min-height: 100vh;
		width: 100%;
		background-color: #F7F7F7;
		padding: 20rpx 20rpx 120rpx 20rpx;

		&.isSubmit {
			padding: 20rpx;
		}

		.workAccessEdit-form {
			padding: 20rpx;
			flex: 1;
			width: 100%;
			margin-top: 20rpx;
			background-color: #FFFFFF;
			border-radius: $common-border-radius;

			.form-header {
				.header-text {
					width: 200rpx;
					font-size: 30rpx;
					color: #1D4393;
					font-weight: bold;
				}
			}
		}
	}
</style>
