<template>
	<view class="attence-execute">
		<u-top-tips ref="uTips"></u-top-tips>
		<u-form :model="form" ref="uForm" :label-style="{fontWeight:'bold',fontSize:'32rpx'}">
			<u-form-item :padding="0" label="任务名称" label-position="top">
				{{urlParams.title}}
			</u-form-item>
			<u-form-item :padding="0" label="上传图片" label-position="top">
				<u-upload :file-list="fileList" name="multipartFile" :max-size="5 * 1024 * 1024" ref="uupload"
					width="160" height="160" :action="action" max-count="1" :before-upload="beforeUpload"
					@onSuccess="onSuccess" @onRemove="onRemove" onError="onError"></u-upload>
			</u-form-item>
		</u-form>
		<fixed-btn v-if="isCanTask">
			<u-button slot="right-button" style="width: 100%;" type="primary" shape="circle" @click="formSubmit">保存
			</u-button>
		</fixed-btn>
	</view>

</template>

<script>
	import apiConfig from '../../config/apiConfig.js'
	export default {
		data() {
			return {
				taskDetail: [],
				urlParams: {},
				fileList: [],
				isCanTask: false,
				action: `${this.$global[`${this.$global.mode}Address`]}/pub-biz-base/file/upload`,
				currentUploadUrl: null
			};
		},
		onShow() {
			this.isCanTask = false
			this.urlParams = this.$util.getUrlParams()
			this.fileList = []
			this.getSalesTaskDetail()
		},
		methods: {
			beforeUpload() {
				uni.showLoading({
					title: '图片上传中'
				})
			},
			onSuccess(data, index, lists, name) {
				uni.hideLoading()
				this.currentUploadUrl = data.data
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
			onRemove() {
				this.currentUploadUrl = null;
			},
			formSubmit() {
				this.commitExecuRecord()
			},
			commitExecuRecord() {
				if (!this.currentUploadUrl) {
					this.$util.showToast({
						title: '请上传图片或等待图片上传完成',
						icon: 'none'
					})
				} else {
					const {
						staffId: userId
					} = uni.getStorageSync('userInfo')
					const {
						clinicId,
						tacId
					} = this.urlParams
					const [{
						eid
					}] = this.taskDetail
					const params = {
						userId,
						clinicId,
						tacId,
						detailQoList: [{
							eid,
							content: this.currentUploadUrl,
							type: ''
						}]
					}
					uni.showLoading({
						title: '任务保存中'
					})
					this.$requestData(apiConfig.commitExecuRecord, params, {
						query: {
							id: params.userId
						}
					}).then(({
						data
					}) => {
						if (data) {
							uni.navigateBack()
							this.$util.showToast({
								title: '任务保存成功'
							})
						} else {
							this.$util.showToast({
								title: '任务保存失败'
							})
						}

					})
				}
			},
			getSalesTaskDetail() {

				const {
					ttid
				} = this.urlParams

				this.$requestData(apiConfig.getSalesTaskDetail, {
					ttid
				}).then((res) => {
					this.isCanTask = true
					this.taskDetail = res.data
				})
			}
		}

	}
</script>

<style lang="scss">
	.attence-execute {
		padding: 30rpx;
	}
</style>
