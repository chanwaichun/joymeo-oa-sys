<template>

	<view class="common-container-top common-container-bottom ">
		<SearchInput v-if="customerType === 'normal'" buttonName="搜索客户" placeholder="请输入门诊名称"
			@buttonClick="(searchName) => getCustomerList(searchName)">
		</SearchInput>
		<u-popup v-model="show" mode="top" height="50%">
			<u-cell-group>
				<u-cell-item v-for="(item,index) in customerList" :key="index" :title="item.clinicName"
					@click="clickCell($event,item)"></u-cell-item>
			</u-cell-group>

		</u-popup>

		<u-form :model="form" ref="uForm" label-width="200">
			<template v-if="customerType === 'normal'">
				<view class="form-card">
					<u-cell-group title="诊所基本信息">
						<u-form-item label="门诊名称" prop="clinicName" required>
							<u-input v-model="form.clinicName" maxlength="50" placeholder="请输入门诊名称" />
						</u-form-item>
						<u-form-item label-position="top" label="诊所区域" required>

							<uni-data-picker placeholder="请选择地址" v-model="areaCode" :preload="true" :border="false"
								popup-title="请选择城市" :localdata="regionDataFirst" @change="regionChange">
							</uni-data-picker>

							<u-icon @click="handleResetAreaCode" slot="right" name="close-circle-fill"></u-icon>

						</u-form-item>
						<u-form-item label="诊所地址" prop="address" required>
							<u-input v-if="form.lat && form.lng" maxlength="200" v-model="form.address"
								placeholder="请输入诊所区域" />
							<u-button slot="right" size="mini" shape="circle" type="primary" @click="chooseAddress">选择地址
							</u-button>
						</u-form-item>
						<u-form-item label-position="top" label="诊所医生人数">

							<uni-data-checkbox v-model="form.doctorNumber" :localdata="selectItem.doctorNumber"
								mode="tag">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label-position="top" label="诊所辅助人员人数">
							<uni-data-checkbox v-model="form.assistantNumber" :localdata="selectItem.assistantNumber"
								mode="tag">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label-position="top" label="诊所人员关系(多选)" :borderBottom="false">
							<uni-data-checkbox v-model="form.relationship" :localdata="selectItem.relationship"
								mode="tag" multiple>
							</uni-data-checkbox>
						</u-form-item>
					</u-cell-group>
				</view>
				<u-gap height="20" bg-color="#F7F7F7"></u-gap>
				<view class="form-card">
					<u-cell-group title="医生基本信息">
						<u-form-item label="医生姓名">
							<u-input v-model="form.majorDoctor" maxlength="50" placeholder="请输入医生姓名" />
						</u-form-item>
						<u-form-item label="医生性别">
							<uni-data-checkbox v-model="form.gender" :localdata="selectItem.gender">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label="医生年龄" prop="age">
							<u-input v-model="form.age" type="number" maxlength="3" placeholder="请输入医生年龄" />
						</u-form-item>
						<u-form-item label="行医年龄" prop="operationYears">
							<u-input v-model="form.operationYears" type="number" maxlength="3" placeholder="请输入行医年龄" />
						</u-form-item>
						<u-form-item label="联系方式" prop="telPhone">
							<u-input v-model="form.telPhone" type="number" maxlength="11" placeholder="请输入联系方式" />
						</u-form-item>
						<u-form-item label-position="top" label="使用手机品牌">
							<uni-data-checkbox v-model="form.phoneBrand" :localdata="selectItem.phoneBrand" mode="tag">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label-position="top" label="手机常用app(多选)" :borderBottom="false">
							<uni-data-checkbox v-model="form.usedApp" :localdata="selectItem.usedApp" mode="tag"
								multiple>
							</uni-data-checkbox>
						</u-form-item>
					</u-cell-group>
				</view>
				<u-gap height="20" bg-color="#F7F7F7" v-if="pageParams.pageNum >= 2"></u-gap>
				<view class="form-card" v-if="pageParams.pageNum >= 2">
					<u-cell-group title="诊所核心信息">

						<u-form-item label="是否自建房">
							<uni-data-checkbox slot="right" v-model="form.buildRoom" :localdata="selectItem.buildRoom">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label="诊所租金" prop="rent">
							<view class="u-flex">
								<u-input :style="{flex:1}" v-model="form.rent" maxlength="50" type="number"
									placeholder="请输入诊所租金" />
								</u-input>
								元
							</view>
						</u-form-item>
						<u-form-item label="诊所面积" prop="clinicArea">
							<view class="u-flex">
								<u-input :style="{flex:1}" v-model="form.clinicArea" maxlength="50" type="number"
									placeholder="请输入诊所面积" />m²
							</view>
						</u-form-item>
						<u-form-item label="诊所年均收入" prop="annualIncome">
							<view class="u-flex">
								<u-input :style="{flex:1}" v-model="form.annualIncome" maxlength="50" type="number"
									placeholder="请输入年均收入" />万元
							</view>
						</u-form-item>
						<u-form-item label-position="top" label="诊所开办年限">
							<uni-data-checkbox mode="tag" v-model="form.runningTime"
								:localdata="selectItem.runningTime">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label="进货渠道">
							<u-input v-model="form.inboundChannel" maxlength="250" placeholder="请输入进货渠道" />
						</u-form-item>
						<u-form-item label="诊所上级监管部门">
							<u-input v-model="form.supervisionDepartment" maxlength="250" placeholder="请输入诊所上级监管部门" />
						</u-form-item>
						<u-form-item label-position="top" label="诊所资质(多选)">
							<uni-data-checkbox v-model="form.certification" :localdata="selectItem.certification"
								mode="tag" multiple="">
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label-position="top" label="诊所旺季(多选)">
							<uni-data-checkbox v-model="form.busySeason" :localdata="selectItem.busySeason" mode="tag"
								multiple>
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label-position="top" label="诊所经常使用结款方式(多选)">
							<uni-data-checkbox v-model="form.paymentWay" :localdata="selectItem.paymentWay" mode="tag"
								multiple>
							</uni-data-checkbox>
						</u-form-item>
						<u-form-item label="诊所是否有意愿和卓悦签约合作" label-width="400" :borderBottom="false">
							<uni-data-checkbox slot="right" :disabled="cooperateBak && isEdit" v-model="form.cooperate"
								:localdata="selectItem.cooperate">
							</uni-data-checkbox>
						</u-form-item>
					</u-cell-group>
				</view>

			</template>
			<!-- <NormalForm :modal="form" v-if="customerType === 'other'"></NormalForm> -->
			<template v-if="customerType === 'other'">
				<view class="form-card">
					<u-form-item label="客户名称" prop="unClinicName" required>
						<u-input v-model="form.unClinicName" maxlength="50" placeholder="请输入客户名称" />
					</u-form-item>
					<u-form-item label-position="top" label="客户区域" required>

						<uni-data-picker placeholder="请选择地址" v-model="areaCode" :preload="true" :border="false"
							popup-title="请选择城市" :localdata="regionDataFirst" @change="regionChange">
						</uni-data-picker>

						<u-icon @click="handleResetAreaCode" slot="right" name="close-circle-fill"></u-icon>

					</u-form-item>
					<u-form-item label="客户地址" prop="address" required>
						<u-input v-if="form.lat && form.lng" maxlength="200" v-model="form.address"
							placeholder="请输入客户地址" />
						<u-button slot="right" size="mini" shape="circle" type="primary" @click="chooseAddress">选择地址
						</u-button>
					</u-form-item>
					<u-form-item label="联系方式" prop="telPhone" required>
						<u-input v-model="form.telPhone" type="number" maxlength="11" placeholder="请输入联系方式" />
					</u-form-item>
					<u-form-item label-position="top" label="客户类型" :borderBottom="false" prop="unClinicType" required>
						<uni-data-checkbox v-model="form.unClinicType" :localdata="selectItem.unClinicType" mode="tag">
						</uni-data-checkbox>
					</u-form-item>
				</view>
			</template>
		</u-form>
		<FixedBtn>
			<u-button slot="right-button" style="width: 100%;" type="primary" shape="circle" @click="onSubmit">立即保存
			</u-button>
		</FixedBtn>
	</view>

</template>

<script>
	import FixedBtn from '@/components/FixedBtn/FixedBtn.vue'
	import selectConfig from '@/config/selectConfig.js';
	import apiConfig from '@/config/apiConfig.js';
	import util from '@/utils/util.js'
	import formMixin from '@/mixins/formMixin.js'
	import tabMixin from '@/mixins/tabMixin.js'
	import formValidator from './utils/formValidator.js'
	import formInitConfig from './utils/formInitConfig.js'

	// import region from './region.js'
	export default {
		mixins: [formMixin, tabMixin],
		components: {
			FixedBtn,
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		onReachBottom() {
			if (this.customerType === 'normal') {
				this._tabPageReachBottom_on_mixins(() => {
					if (this.pageParams.pageNum === 2) {
						this.isCanUpdate = false
					}
				})
			}

		},
		mounted() {
			this.$util.getRigonData((data) => {
				this.getAppGlobalData(data)
				this.getCustomerDetailByParams()
			}, true)
			// 订阅这个请求，如果拿到数据就立马赋值
			uni.$on('onGetRigonData', (data) => {
				this.getAppGlobalData(data)
				this.getCustomerDetailByParams()
			});
		},
		onShow() {
			// 发起请求数据
			this.$util.getRigonData((data) => {
				this.getAppGlobalData(data)
			}, true)
		},
		watch: {
			form: {
				handler(newVal, oldVal) {
					if (newVal.address === '') {
						newVal.lat = '';
						newVal.lng = '';
					}
				},
				deep: true,
				immediate: true
			}

		},
		data() {
			return {
				show: false,
				searchName: '',
				customerList: [],
				isEdit: false,
				selectItem: selectConfig.getSelectItem(),
				regionDataFirst: [],
				pageParams: {
					pageNum: 1,
					pageSize: 1
				},
				isCanUpdate: true,
				urlParams: {},
				rules: '',
				cooperateBak: false,
				areaCode: null,
				areaCodeArray: [],
				customerType: '',
				form: ''
			};
		},
		methods: {
			getAppGlobalData(data) {
				if (getApp().globalData.userRegionData.length > 0) {
					this.regionDataFirst = getApp().globalData.userRegionData;
				} else {
					this.regionDataFirst = data;
					getApp().globalData.userRegionData = data
				}
			},
			// 获取客户信息
			getCustomerDetailByParams() {
				this.urlParams = util.getUrlParams()
				// 如果有cid说明是编辑模式
				if (this.urlParams.type === 'other') {
					this.form = JSON.parse(JSON.stringify(formInitConfig.other));
					this.customerType = 'other';
					this.rules = formValidator.other
					if (this.urlParams.hasOwnProperty('id')) {
						this.getUnclinicDetail(this.urlParams.id)
					}
				} else {
					this.form = JSON.parse(JSON.stringify(formInitConfig.normal));
					this.customerType = 'normal';
					this.rules = formValidator.normal
					if (this.urlParams.hasOwnProperty('cid')) {
						this.getCustomerDetail(this.urlParams.cid)
					} else {
						// 新增信息模式
						this.isEdit = false
						this.form.cooperate = 'false'
					}
				}

			},
			clickCell(e, item) {
				this.getCustomerDetail(item.cid)

			},
			regionChange(e) {
				this.areaCodeArray = e.detail.value.map(item => item.value)
			},
			handleResetAreaCode() {
				this.resetCodeArray();
				this.resetCode()
			},
			// 重新设置地区编码
			resetCodeArray(codeObject = null) {
				if (!codeObject) {
					this.areaCodeArray = [];
					return;
				}
				const {
					province,
					city,
					district,
					township
				} = codeObject
				this.areaCodeArray = [Number(province), Number(city), Number(district), Number(township)]
			},
			resetCode(code = null) {
				this.areaCode = code
			},
			checkeArrayAndToString(obj) {
				let newObj = {};

				Object.keys(obj).forEach(key => {
					newObj[key] = util.getValueType(obj[key]) === 'Array' ? obj[key].join(',') : obj[key]
				})
				return newObj;
			},
			getCustomerList(searchName) {
				uni.showLoading({
					title: '客户列表加载中'
				})
				const {
					staffId: salesmanId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.customerGetList, {
					salesmanId,
					clinicName: searchName
				}).then(({
					data
				}) => {
					if (data.records.length > 0) {
						this.customerList = data.records
						this.show = true
					} else {
						wx.showToast({
							title: '暂无客户信息',
							icon: 'none'
						})
					}

					uni.hideLoading()
				})
			},
			// 获取非诊所客户详情
			getUnclinicDetail(id) {
				uni.showLoading({
					title: '客户信息加载中'
				})
				this.$requestData(apiConfig.getUnclinicDetail, {
					id
				}).then(({
					data
				}) => {
					let {
						unClinicName, //非诊所客户名称
						address, //地址
						regionName, //区域中文(xx省xx市xx县xx镇)
						telPhone, //联系方式
						unClinicType, //客户类型(单体药店,连锁药店,商业公司)
						salesmanId, //所属销售id
						salesmanName, //销售姓名
						lat,
						lng,
						province,
						city,
						district,
						township,
					} = data
					this.form = {
						unClinicName, //非诊所客户名称
						address, //地址
						telPhone, //联系方式
						unClinicType: String(unClinicType), //客户类型(单体药店,连锁药店,商业公司)
						lat,
						lng
					}
					this.resetCodeArray({
						province,
						city,
						district,
						township
					})
					this.resetCode(Number(township));
					uni.hideLoading()
				})
			},
			// 获取客户详情
			getCustomerDetail(cid) {

				uni.showLoading({
					title: '客户信息加载中'
				})
				this.$requestData(apiConfig.customerGetDetail, {
					cid
				}).then(({
					data
				}) => {

					uni.hideLoading()
					let obj = {};
					['usedApp', 'certification', 'busySeason', 'relationship', 'paymentWay'].forEach(item => {
						obj[item] = data[item].split(',')
					});
					['gender', 'cooperate', 'buildRoom'].forEach(item => {
						obj[item] = String(data[item])
					});
					let {
						// 诊所基本信息
						clinicName,
						clinicDistrict,
						address,
						lat,
						lng,
						doctorNumber,
						assistantNumber,
						relationship,
						// 医生基本信息
						majorDoctor,
						age,
						operationYears,
						telPhone,
						phoneBrand,
						usedApp,
						// 诊所核心信息
						clinicArea,
						annualIncome,
						runningTime,
						inboundChannel,
						supervisionDepartment,
						certification,
						busySeason,
						paymentWay,
						province,
						city,
						district,
						township,
						rent,
						cooperate,
						cid
					} = data
					this.resetCodeArray({
						province,
						city,
						district,
						township
					})
					this.resetCode(Number(township))
					// 开启编辑状态
					this.cooperateBak = cooperate;

					this.show = false;
					this.form = {
						cid,
						clinicName,
						clinicDistrict,
						address,
						lat,
						lng,
						doctorNumber,
						assistantNumber,
						relationship,
						// 医生基本信息
						majorDoctor,
						age,
						operationYears,
						telPhone,
						phoneBrand,
						// 诊所核心信息
						clinicArea,
						annualIncome,
						runningTime,
						inboundChannel,
						supervisionDepartment,
						paymentWay,
						rent,
						...obj
					}
					this.isEdit = true;
					uni.hideLoading()

				})
			},
			updateCustomerDetail(params) {
				uni.showLoading({
					title: '客户信息更新中'
				})
				this.$requestData(apiConfig.customerUpdate, this.checkeArrayAndToString(params)).then(({
					code,
					data,
					message
				}) => {
					uni.hideLoading()
					if (code === 200) {
						uni.navigateBack()
						this.$util.showToast({
							title: '更新成功'
						})

					} else {
						this.$util.showToast({
							title: '更新失败',
							icon: 'none'
						})
					}

				})
			},
			insertCustomerDetail(params) {
				uni.showLoading({
					title: '客户信息保存中'
				})
				this.$requestData(apiConfig.customerInsert, this.checkeArrayAndToString(params)).then(({
					data,
					message
				}) => {
					uni.hideLoading()
					if (data) {
						uni.navigateBack()
						this.$util.showToast({
							title: '保存成功'
						})

					} else {
						this.$util.showToast({
							title: '保存失败',
							icon: 'none'
						})
					}

				})

			},
			updateUnclinicDetail(params) {

				uni.showLoading({
					title: '客户信息保存中'
				})
				this.$requestData(apiConfig.unclinicUpdate, this.checkeArrayAndToString(params)).then(({
					data,
					message
				}) => {
					uni.hideLoading()
					if (data) {
						this.$util.showToast({
							title: '保存成功'
						})
						uni.navigateBack()
					} else {
						this.$util.showToast({
							title: '保存失败',
							icon: 'none'
						})
					}
				})


			},
			insertUnclinicDetail(params) {
				uni.showLoading({
					title: '客户信息保存中'
				})
				this.$requestData(apiConfig.unclinicInsert, this.checkeArrayAndToString(params)).then(({
					data,
					message
				}) => {
					uni.hideLoading()
					if (data) {
						this.$util.showToast({
							title: '保存成功'
						})
						uni.navigateBack()
					} else {
						this.$util.showToast({
							title: '保存失败',
							icon: 'none'
						})
					}
				})
			},

			formSubmit() {
				if (!this.areaCode) {
					uni.showToast({
						title: '请选择诊所区域',
						icon: 'none'
					})
					return;
				}
				const {
					staffId: salesmanId
				} = uni.getStorageSync('userInfo')
				if (this.customerType === 'other') {
					this.submitOtherForm({
						salesmanId
					})
				} else {
					this.sumbitNormalForm({
						salesmanId
					})
				}

			},
			// 提交非客户表单
			submitOtherForm(params) {
				let newForm = {
					...this.form,
					// 获取地区code
					// ...util.getAreaCode(this.areaCode),
					...util.getAreaCodeByArray(this.areaCodeArray),
					...params
				};

				if (newForm.id) {
					this.updateUnclinicDetail(newForm)
				} else if (this.urlParams.hasOwnProperty('id')) {
					newForm = {
						...newForm,
						id: this.urlParams.id
					}
					this.updateUnclinicDetail(newForm)
				} else {
					// 保存
					this.insertUnclinicDetail(newForm)
				}
			},
			// 提交普通表单
			sumbitNormalForm(params) {
				let newForm = {
					...this.form,
					// 获取地区code
					...util.getAreaCodeByArray(this.areaCodeArray),
					addressSplicing: this.form.address,
					...params
				};
				// 更新
				if (newForm.cid) {
					this.updateCustomerDetail(newForm)
				} else if (this.urlParams.hasOwnProperty('cid')) {
					newForm = {
						...newForm,
						cid: this.urlParams.cid
					}
					this.updateCustomerDetail(newForm)
				} else {
					// 保存
					this.insertCustomerDetail(newForm)
				}
			},

			chooseAddress() {
				uni.chooseLocation({
					success: (res) => {
						const {
							latitude,
							longitude,
							address
						} = res;
						this.form.address = address;
						this.form.lat = latitude;
						this.form.lng = longitude;
					},
					fail: () => {
						this.$util.showToast({
							title: '当前位置获取失败,请检查定位服务是否开启',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.page-customerAdd {
		background-color: #F7F7F7;
	}

	.form-card {
		padding: 0px 32rpx 32rpx 32rpx;
	}
</style>
