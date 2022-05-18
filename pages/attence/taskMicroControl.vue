<template>
	<view class="taskMicroControl common-container-bottom">
		<u-picker v-model="show" mode="time" :params="pickerOption" @confirm="calendarConfirm">
		</u-picker>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-modal v-model="tipsShow" title="提示" content="任务提交成功" @confirm="tipsConfirm"></u-modal>
		<view class="taskMicroControl-title" v-if="pageParams.pageNum === 1">
			<view class="title-info">任务名称</view>
			<view class="title-value word-break-all">{{taskName||''}}</view>
		</view>
		<view class="taskMicroControl-taskList" v-if="taskDetail && taskDetail.records.length > 0">
			<view class="taskList-item" v-for="(itemObj,itemObjIndex) in taskDetail.records" :key="itemObjIndex"
				:class="[failIndex.includes(itemObjIndex)?'taskList-item_fail':'']">
				<view class="item-header u-flex u-row-between" v-if="itemObj.elementType !== 'DATE'">
					<view class="header-title max-width-400 word-break-all"><text class="required"
							v-if="itemObj.required">*</text>{{itemObj.name}}</view>
					<view class="header-type">{{fieldMap.getFieldAttribute(itemObj.elementType,'name')}}</view>
				</view>
				<view class="item-component" :class="[itemObj.elementType === 'DATE' ? 'item-component-date':'']">
					<!-- 单选组件 -->

					<u-radio-group :size="45" :wrap="true" v-if="itemObj.elementType === 'RADIO'"
						:value="setRadioActive(itemObj.content)">
						<u-radio :label-size="32"
							v-for="(questionItem, questionIndex) in formatArray(itemObj.question,itemObj.elementType)"
							:key="questionIndex" :name="questionItem.name"
							@change="(name)=>radioChange(name,itemObjIndex)" :radioItemStyle="{width:'100%'}">
							<view class="component-radio u-flex" style="padding: 2rpx;">
								<!-- 如果出现other -->

								{{translateOtherEnum(questionItem.name)}}
								<!-- 选择到其他的时候显示输入框 -->
								<template v-if="questionItem.name === 'other' && itemObj.content[0].type === 'other'">
									<u-input :clearable="false" :style="{marginLeft:'20rpx'}"
										:value="itemObj.content[0].value"
										@blur="(value)=>inputBlur(value,itemObjIndex,itemObj.elementType)"></u-input>
								</template>

							</view>

						</u-radio>
					</u-radio-group>
					<!-- 多选组件 -->
					<u-checkbox-group :size="45" :wrap="true" v-if="itemObj.elementType === 'MULTIPLE'">
						<u-checkbox :label-size="32" :value="setMultipleActive(questionItem,itemObj.content)"
							v-for="(questionItem, questionIndex) in  formatArray(itemObj.question,itemObj.elementType)"
							:key="questionIndex" :name="questionItem.name" :checkItemStyle="{width:'100%'}"
							@change="(data)=>checkboxChange(data,itemObjIndex)">

							<view class="u-flex" style="padding: 2rpx;">
								<!-- 如果出现other -->
								<template>
									{{translateOtherEnum(questionItem.name)}}
								</template>
								<!-- 选择到其他的时候显示输入框 -->
								<template v-if="isOtherSelected(questionItem,itemObj.content)">
									<u-input :style="{marginLeft:'20rpx'}" :clearable="false"
										:value="itemObj.content ? itemObj.content[otherSelectedIndex(itemObj.content)].value:''"
										@blur="(value)=>inputBlur(value,itemObjIndex,itemObj.elementType)"></u-input>
								</template>

							</view>
						</u-checkbox>
					</u-checkbox-group>
					<!-- 文本输入组件 -->
					<u-input :customStyle="{backgroundColor:'#F7F7F7',padding:'20rpx',borderRadius: '20rpx'}"
						:clearable="false" v-if="itemObj.elementType === 'TEXT'" type="textarea"
						:value="setDefaultValue(itemObj.content)"
						@input="(value)=>inputBlur(value,itemObjIndex,itemObj.elementType)"></u-input>
					<!-- 上传组件 -->
					<u-upload :size-type="['compressed']" :max-count="itemObj.upperLimit"
						:source-type="setSourceType(itemObj)" v-if="itemObj.elementType === 'PICTURE'" :action="action"
						:file-list="setUploadActive(itemObj.content,itemObjIndex)" name="multipartFile"
						:max-size="5 * 1024 * 1024" ref="uupload" width="160" height="160" @before-upload="beforeUpload"
						@onSuccess="(data, index, lists, name)=>onSuccess(data, index, lists, name,itemObjIndex)"
						@onRemove="(index)=>onRemove(index,itemObjIndex)" @onError="onError">
					</u-upload>
					<!-- 时间选择 -->
					<view class="component-date u-flex u-row-between" v-if="itemObj.elementType === 'DATE'"
						@click="showModal(itemObjIndex)">
						<view class="date-title max-width-300"><text class="required"
								v-if="itemObj.required">*</text>{{itemObj.name}}</view>
						<view class="date-value" :class="[!setDefaultValue(itemObj.content)?'inactive':'']">
							{{setDefaultValue(itemObj.content) ? setDefaultValue(itemObj.content):'点击选择'}}
							<u-icon name="arrow-right" color="#C8CACC" size="28"></u-icon>
						</view>


					</view>
					<!-- 地理位置 -->
					<view class="component-location" v-if="itemObj.elementType === 'LOCATION'">
						<view class="location-address">
							<u-icon v-if="setDefaultValue(itemObj.content)" name="map-fill" color="#4975C0" size="28">
							</u-icon>
							{{setDefaultValue(itemObj.content) ? setDefaultValue(itemObj.content).address || '' :''}}
						</view>

						<u-button type="primary" :custom-style="{width:'360rpx',marginBottom:'20rpx'}" shape="circle"
							:plain="true" @click="chooseAddress(itemObjIndex)">
							<u-icon v-if="!setDefaultValue(itemObj.content)" class="location-icon" name="map-fill"
								color="#4975C0" size="28"></u-icon>
							{{setDefaultValue(itemObj.content) ? '重新选择地址' : '请选择地址'  }}
						</u-button>
					</view>

				</view>
			</view>
		</view>
		<FixedBtn>
			<u-button v-if="taskDetail && taskDetail.records.length >0 && pageParams.pageNum !== 1" slot="left-button"
				style="flex: 1;margin-right: 32rpx;" type="primary" shape="circle" @click="prevPage">上一页
			</u-button>
			<u-button
				v-if="taskDetail && taskDetail.records.length >0 && taskDetail.records.length >= pageParams.pageSize"
				slot="right-button" style="flex: 1;" type="primary" shape="circle" @click="nextPage">下一页
			</u-button>
			<u-button
				v-if="taskDetail && taskDetail.records.length >0 && taskDetail.records.length < pageParams.pageSize"
				slot="right-button" style="flex: 1;" type="primary" shape="circle" @click="submit(null,'submit')">提交
			</u-button>
		</FixedBtn>
	</view>
</template>

<script>
	import fieldMap from '@/fieldMap/fieldNormal.js'
	import FixedBtn from '@/components/FixedBtn/FixedBtn.vue'
	import apiConfig from '@/config/apiConfig.js'
	export default {
		components: {
			FixedBtn
		},
		data() {
			return {
				tipsShow: false,
				urlParams: null,
				taskName: null,
				// 日期选择需要用到的当前选择的
				currentIndex: null,
				// 校验失败的索引
				failIndex: [],
				// 当前的距离
				distance: null,
				latitude: null,
				longitude: null,
				// 日期选择的设置
				pickerOption: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				// 分页参数
				pageParams: {
					pageNum: 1,
					pageSize: 10
				},
				erid_bak: '',
				// 任务详情
				taskDetail: null,
				// 字段字典表
				fieldMap,
				show: false,
				action: `${this.$global[`${this.$global.mode}Address`]}/pub-biz-base/file/upload`,
				// 存储照片根据索引值
				fileListObj: {},
			}

		},
		watch: {
			show(newVal) {
				if (!newVal) {
					this.currentIndex = null
				}
			}
		},
		mounted() {
			// 请求微操详情
			this.urlParams = this.$util.getUrlParams();
			this.getTaskMicroDetail()
		},
		methods: {
			// 通用
			submit(callback = null, type = null) {
				this.checkFormData()
				if (this.failIndex.length === 0) {
					this.submitExecuRecord(callback, type)
				}
			},
			prevPage() {

				this.pageParams.pageNum -= 1
				this.getTaskMicroDetail()


			},
			nextPage() {
				this.submit(() => {
					this.pageParams.pageNum += 1
					this.getTaskMicroDetail()
				}, 'nextPage')


			},
			tipsConfirm() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 校验提交的数据是否符合要求
			checkFormData() {
				let failIndex = [];
				const limitCheck = ['MULTIPLE', 'PICTURE'];
				const toastRule = {
					SELECTED: () => {
						this.$util.showToast({
							title: `请输入其他项`,
							icon: 'none'
						})
					},

					RADIO: () => {
						this.$util.showToast({
							title: `请输入其他项`,
							icon: 'none'
						})
					},

					MULTIPLE: () => {
						this.$util.showToast({
							title: `请输入其他项`,
							icon: 'none'
						})
					},
					PICTURE: () => {
						this.$util.showToast({
							title: `请上传图片`,
							icon: 'none'
						})
					},
					DATE: () => {
						this.$util.showToast({
							title: `请输入日期`,
							icon: 'none'
						})
					},
					LOCATION: (content) => {
						this.$util.showToast({
							title: `请输入定位`,
							icon: 'none'
						})
					}
				}
				const limitRule = {
					MULTIPLE: (content, itemObj) => {
						const {
							lowerLimit,
							upperLimit
						} = itemObj;

						if (content.length < lowerLimit && lowerLimit !== 0) {
							this.$util.showToast({
								title: `多选选项至少${lowerLimit}个`,
								icon: 'none'
							})
							return false

						}
						if (content.length > upperLimit && upperLimit !== 0) {
							this.$util.showToast({
								title: `多选选项最多${upperLimit}个`,
								icon: 'none'
							})
							return false
						}
						return true

					},
					PICTURE: (content, itemObj, itemObjIndex) => {
						const {
							lowerLimit,
							upperLimit
						} = itemObj;
						if (this.fileListObj[itemObjIndex].length < lowerLimit && lowerLimit !== 0) {
							this.$util.showToast({
								title: `图片上传至少${lowerLimit}个`,
								icon: 'none'
							})
							return false

						}
						if (this.fileListObj[itemObjIndex].length > upperLimit && upperLimit !== 0) {
							this.$util.showToast({
								title: `图片上传最多${upperLimit}个`,
								icon: 'none'
							})
							return false

						}
						return true

					},
				}
				const checkRule = {
					RADIO: (content) => {
						return content[0].value
					},
					MULTIPLE: (content, itemObj) => {
						let index = content.findIndex((contentItem, contentIndex) => {
							return !contentItem.value
						})
						return index === -1
					},
					TEXT: (content) => {
						return content[0].value
					},
					PICTURE: (content, itemObj, itemObjIndex) => {
						return this.fileListObj && this.fileListObj.hasOwnProperty(itemObjIndex) && this
							.fileListObj[itemObjIndex].length > 0
					},
					DATE: (content) => {
						return content[0].value
					},
					LOCATION: (content) => {
						return content[0].value.lng && content[0].value.lat && content[0].value.address
					}
				}

				this.taskDetail.records.every((itemObj, itemIndex) => {

					if (itemObj.required) {
						// 检查是否有未填写的数据
						if (!this.checkContentType(itemObj.content)) {
							if (itemObj.elementType === 'PICTURE') {
								if (!checkRule[itemObj.elementType](itemObj.content, itemObj, itemIndex)) {
									failIndex.push(itemIndex)
									this.$util.showToast({
										title: '存在必填项未填',
										icon: 'none'
									})
									return false;
								}

							} else {
								failIndex.push(itemIndex)
								this.$util.showToast({
									title: '存在必填项未填',
									icon: 'none'
								})
								return false;
							}
						}
						// 是否有限制条件
						if (limitCheck.includes(itemObj.elementType)) {
							// 如果符合限制项
							if (limitRule[itemObj.elementType](itemObj.content, itemObj, itemIndex)) {
								//放行
								if (checkRule[itemObj.elementType](itemObj.content, itemObj, itemIndex)) {
									return true
								} else {
									toastRule[itemObj.elementType]()
									failIndex.push(itemIndex)
									return false;
								}

							} else {
								// 不符合不放行 跳出循环
								failIndex.push(itemIndex)
								return false
							}
						} else if (checkRule[itemObj.elementType](itemObj.content, itemObj)) {
							return true;
						} else {
							toastRule[itemObj.elementType]()
							failIndex.push(itemIndex)
							return false;
						}
					} else if (limitCheck.includes(itemObj.elementType) && this.checkContentType(itemObj
							.content)) {
						// 如果符合限制项 且 不为空
						if (limitRule[itemObj.elementType](itemObj.content, itemObj, itemIndex)) {
							//放行
							return true

						} else {
							// 不符合不放行 跳出循环
							failIndex.push(itemIndex)
							return false
						}
					} else {
						return true
					}
				})
				this.failIndex = failIndex;
				return failIndex.length !== 0
			},
			checkContentType(content) {
				if (this.$util.getValueType(content) === 'Array' && content && content.length > 0) {
					return true
				}
				return false
			},
			// 设置上传的文件
			setUploadActive(content, itemObjIndex) {
				if (this.checkContentType(content)) {

					return content.map(item => ({
						url: item.value
					}))
				}
				return []

			},
			// 设置上传图片的方式
			setSourceType(itemObj) {
				const {
					uploadMode
				} = itemObj
				if (uploadMode === 'BOTHALL') {
					return ['album', 'camera']
				} else {
					return ['camera']
				}
			},
			setDefaultValue(content) {
				return this.checkContentType(content) ? content[0].value : ''
			},
			// 把other字段转化为中文其他显示
			translateOtherEnum(name) {
				return name === 'other' ? '其他' : name
			},
			// 找出other的索引值
			otherSelectedIndex(content) {
				return content.findIndex((item) => item.type === 'other')
			},
			//判断是否有其他选项
			isOtherSelected(questionItem, content) {
				return content ? this.otherSelectedIndex(content) > -1 && questionItem.name === 'other' : false
			},
			// 设置多选的选中值
			setMultipleActive(questionItem, content) {
				if (!this.checkContentType(content)) {
					return false
				}

				// 已勾选的选项
				const trueList = content.map(item => item.value)
				// 如果有其他的选项而且选项名为other的
				if (this.isOtherSelected(questionItem, content)) {
					return true
				} else {
					// 其余根据已勾选选项回显
					return trueList.includes(questionItem.name);
				}

			},
			// 设置单选的选中值
			setRadioActive(content) {

				if (!content || content.length < 1) {
					return ''
				}
				const [{
					value,
					type
				}] = content;
				if (type === 'other') {
					return 'other'
				}
				return value
			},
			/* value {String} 当前选中的值
			 *  itemObjIndex {Number} 题目下标
			 *  type {String} 题目类型
			 *  desription:仅限于其他项的输入或者文本的属于
			 */
			inputBlur(value, itemObjIndex, type) {
				if (type === 'RADIO' || type === 'TEXT') {
					this.taskDetail.records[itemObjIndex].content = [{
						value,
						type: type === 'RADIO' ? 'other' : 'general'
					}]
				} else {
					const index = this.otherSelectedIndex(this.taskDetail.records[itemObjIndex].content)
					this.taskDetail.records[itemObjIndex].content[index].value = value

				}

			},
			/* value {String} 当前选中的值
			 *  itemObjIndex {Number} 题目下标
			 */
			radioChange(value, itemObjIndex) {
				// 根据value值判断是否是其他选项 再定制化输出
				const translateFunc = (value) => {
					if (value === 'other') {
						return {
							value: '',
							type: 'other'
						}
					} else {
						return {
							value,
							type: 'general'
						}
					}
				}
				this.taskDetail.records[itemObjIndex].content = [translateFunc(value)]
			},

			/* 	data {Object} {value:'',name:''} value:布尔值 name:选项名称 当前选中的对象值
			 *  itemObjIndex {Number} 题目下标
			 *  desription:仅限于其他项的输入
			 */
			checkboxChange(data, itemObjIndex) {
				const {
					value,
					name
				} = data
				let prevContent = this.taskDetail.records[itemObjIndex].content
				const translateFunc = (name) => {

					if (name === 'other') {
						return {
							value: '',
							type: 'other'
						}
					} else {
						return {
							value: name,
							type: 'general'
						}
					}
				};
				if (value) {
					this.taskDetail.records[itemObjIndex].content = [translateFunc(name), ...prevContent]
				} else {
					this.taskDetail.records[itemObjIndex].content = prevContent.filter(item => {
						if (name === 'other') {
							return item.type !== 'other'
						} else {
							return item.value !== name
						}

					})

				}

			},
			// 格式化question数组为组件可用的格式
			formatArray(array, type) {
				if (type === 'RADIO') {
					return array ? array.map(item => ({
						name: item.value
					})) : []
				} else {
					return array ? array.map(item =>
						({
							name: item.value,
							checked: false
						})) : []

				}
			},
			beforeUpload() {
				// console.log(1)
				uni.showLoading({
					title: '图片上传中'
				})
			},
			onSuccess(data, index, lists, name, itemObjIndex) {
				if (!this.fileListObj.hasOwnProperty(itemObjIndex)) {
					this.fileListObj[itemObjIndex] = []
				}
				this.fileListObj[itemObjIndex] = [{
					value: data.data,
					type: 'general'
				}, ...this.fileListObj[itemObjIndex]]
				this.$refs.uTips.show({
					title: '上传成功',
					type: 'success',
					duration: '2300'
				})
			},
			onError() {
				uni.hideLoading()
				this.$refs.uTips.show({
					title: '上传失败',
					type: 'error',
					duration: '2300'
				})
			},
			onRemove(imageIndex, itemObjIndex) {
				this.fileListObj[itemObjIndex] = this.fileListObj[itemObjIndex].filter((item, index) => {
					return imageIndex !== index
				})
			},
			// 确认日期给表单复制
			calendarConfirm(result) {
				const {
					year,
					month,
					day,
					hour,
					minute,
					second
				} = result
				this.taskDetail.records[this.currentIndex].content = [{
					value: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
					type: 'general'
				}]
			},
			// 显示日期选择的组件
			showModal(itemObjIndex) {
				// 缓存当前索引值
				this.currentIndex = itemObjIndex;
				this.show = true;

			},
			// 选择地址方法
			chooseAddress(itemObjIndex) {
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					success: (res) => {
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						uni.chooseLocation({
							success: (res) => {
								const {
									latitude,
									longitude,
									address
								} = res;
								this.distance = this.$util.getMapDistanceApi({
									lat: this.latitude,
									lng: this.longitude
								}, {
									lat: latitude,
									lng: longitude
								})
								if (this.distance > 500) {
									this.$util.showToast({
										title: '选择的定位大于当前定位500米，请重新选择',
										icon: 'none',
										duration: 4000
									})
								} else {
									this.taskDetail.records[itemObjIndex].content = [{
										value: {
											lat: latitude,
											lng: longitude,
											address,
										},
										type: 'general'
									}]
								}
							},
							fail: (err) => {
								console.log(err)
								// this.$util.showToast({
								// 	title: '当前位置获取失败,请检查定位服务是否开启',
								// 	icon: 'none'
								// })
							}
						})

					},
					fail: (err) => {
						//不允许打开定位
						console.log(err)
						if (err.errMsg.includes('system') || err.errMsg.includes(
								'ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF')) {
							this.$util.showToast({
								title: '当前位置获取失败,请检查手机定位服务是否开启',
								icon: 'none'
							})
							return;
						}
						this.$util.checkAuthorizationInfo()
					}
				})
			},
			getTaskMicroDetail() {
				uni.showLoading({
					title: '任务详情加载中'
				})
				this.fileListObj = {};
				this.taskDetail = null
				this.taskName = null;
				//elementType
				//	   RADIO("单选"),
				//     MULTIPLE("多选"),
				//     TEXT("文本"),
				//     PICTURE("图片上传"),
				//     DATE("日期"),
				//     LOCATION("地理位置");
				// uploadMode
				//     BOTHALL("上传图片或拍照"),
				//     ONLYPHOTO("仅拍照");
				// locateMode
				// ADJUSTMENT("可手动微调(微调范围500m)");
				this.$requestData(apiConfig.getExecuTaskDetail, {
					...this.pageParams,
					...this.urlParams
				}).then((res) => {
					// 兼容上传组件的bug每次用对象存取对应下标的图片链接
					uni.hideLoading()
					this.taskDetail = {
						...res.data,
						records: res.data.records.map(item => {
							return {
								...item,
								question: item.question ? JSON.parse(item.question) : '',
								content: item.content ? JSON.parse(item.content) : ''
							}
						})
					}
					this.taskDetail.records.forEach((item, index) => {
						if (item.elementType === 'PICTURE') {
							this.fileListObj[index] = item.content
						}
					})
					this.taskName = this.taskDetail.records[0].title



				})

			},
			submitExecuRecord(callback, type) {

				uni.showLoading({
					title: '答题更新中'
				})
				const translateContent = (item, index) => {
					if (item.elementType === 'PICTURE') {
						return this.fileListObj.hasOwnProperty(index) && this.fileListObj[index].length > 0 ? JSON
							.stringify(
								this.fileListObj[index]) : ''
					} else {
						return item.content ? JSON.stringify(item.content) : ''
					}
				}
				const erid = this.taskDetail.records[0].erid ? this.taskDetail.records[0].erid : this.erid_bak;
				const params = {
					...this.urlParams,
					erid,
					detailQoList: this.taskDetail.records.map((item, index) => ({
						eid: item.eid,
						type: item.elementType,
						edid: item.edid || '',
						content: translateContent(item, index)
					}))
				}
				this.$requestData(apiConfig.submitExecuRecord, params).then((res) => {
					uni.hideLoading()
					const {
						data
					} = res;
					this.erid_bak = data
					callback && callback()
					if (type === 'submit') {
						this.tipsShow = true
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.taskMicroControl {
		min-height: 100vh;
		background-color: $common-grey-2;

		.required {
			color: red;
		}
	}

	.taskMicroControl-title {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin-bottom: 20rpx;

		.title-info {
			color: $common-color-1;
			font-size: 32rpx;
			margin-bottom: 16rpx;

		}

		.title-value {
			color: $common-blue-1;
			font-size: 28rpx;
		}
	}

	.taskMicroControl-taskList {


		.taskList-item {
			background-color: #FFFFFF;
			padding: 20rpx 20rpx 20rpx 20rpx;
			margin-bottom: 32rpx;

			&.taskList-item_fail {
				border: 1px solid red;
			}

			.item-header {
				border-bottom: 1px solid $common-border-color-2;
				padding-bottom: 20rpx;

				.header-title {
					font-size: 32rpx;
					color: $common-color-1;


				}

				.header-type {
					color: $common-blue-2;
					border: 2rpx solid $common-blue-2;
					border-radius: 76rpx;
					font-size: 28rpx;
					padding: 16rpx 28rpx;
				}
			}

			.item-component {
				padding: 30rpx 10rpx 0rpx 30rpx;

				&.item-component-date {
					padding: 0rpx;
				}



				.component-date {
					.date-title {
						font-size: 32rpx;
					}

					.date-value {
						font-size: 32rpx;

						&.inactive {
							color: $common-grey-4;
						}
					}
				}

				.component-location {
					.location-address {
						margin-bottom: 32rpx;
					}

					.location-icon {
						margin-right: 30rpx;
					}
				}
			}


		}
	}
</style>
