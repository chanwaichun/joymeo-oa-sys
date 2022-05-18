<template>
	<view class="issueFeedback common-container-bottom">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="issueFeedback-card">
			<view class="card-title">
				<view class="title-info">问题描述<text class="isRequired">(必填)</text></view>
				<view class="title-choose">已输入{{ form.feedbackContent.length }}/200</view>
			</view>
			<u-input :customStyle="{
          backgroundColor: '#F7F7F7',
          padding: '20rpx',
          borderRadius: '20rpx',
        }" :clearable="true" type="textarea" maxlength="200" :trim="false" placeholder="请尽量填写10个字以上描述，让我们更好的了解遇到的问题"
				v-model="form.feedbackContent"></u-input>
		</view>
		<view class="issueFeedback-card">
			<view class="card-title">
				<view class="title-info">问题类型<text class="isRequired">(必填)</text></view>
				<view class="title-choose">已选择{{ currentItem.length }}/3</view>
			</view>
			<LabelSelect keyName="id" :current="filterCurrentItem()" :labelData="currentLabelData"
				:labelCount="labelCount" @itemClick="itemClick" @getMore="getMore" @collapse="collapse">
			</LabelSelect>
		</view>
		<view class="issueFeedback-card">
			<view class="card-title">
				<view class="title-info">图片或视频<text>(选填)</text> </view>
				<view class="title-choose">已选择{{ sourceData.length }}/4</view>
			</view>
			<view class="card-describe">视频上传不能超过60s，图片上传不能超过5M</view>
			<CommonUpload ref="CommonUpload" :formData="{ itemName: 'BD' }" :quality="80" mediaType="all" :max="4"
				v-model="sourceData" name="multipartFile" @uploadSuccess="uploadSuccess" @uploadFail="uploadFail"
				@uploadAllFinish="uploadAllFinish" @beforeUpload="beforeUpload" @imgDelete="imgDelete" :action="action">
			</CommonUpload>
		</view>
		<view class="issueFeedback-card">
			<view class="card-title">
				<view class="title-info">问题人员手机<text>(选填)</text></view>
			</view>
			<u-input type="number" :customStyle="{
          backgroundColor: '#F7F7F7',
          padding: '20rpx',
          borderRadius: '20rpx',
        }" placeholder="请输入手机号码" :clearable="true" maxlength="11" v-model="form.userPhone"></u-input>
		</view>

		<FixedBtn>
			<u-button slot="right-button" :disabled="!isCanSubmit" style="width: 100%" type="primary" shape="circle"
				@click="onSubmit">提交
			</u-button>
		</FixedBtn>
	</view>
</template>

<script>
	import FixedBtn from "@/components/FixedBtn/FixedBtn.vue";
	import CommonUpload from "@/components/CommonUpload/CommonUpload.vue";
	import LabelSelect from "@/pages/feedback/components/LabelSelect.vue";
	import apiConfig from "@/config/apiConfig.js";
	import loginMixin from '@/mixins/loginMixin.js'
	export default {
		mixins: [loginMixin],
		components: {
			CommonUpload,
			FixedBtn,
			LabelSelect,
		},
		data() {
			return {
				form: {
					feedbackContent: "", //反馈内容
					userPhone: "", //反馈者手机号
				},
				isCanSubmit: true,
				currentItem: [],
				labelData: [],
				currentLabelData: [],
				sourceData: [],
				action: `${
        this.$global[`${this.$global.mode}Address`]
      }/pub-biz-base/file/upload`,
			};
		},
		computed: {
			labelCount() {
				return this.labelData.length;
			},
		},
		watch: {
			form: {
				handler(newVal, oldVal) {
					newVal.feedbackContent = newVal.feedbackContent.slice(0, 200);
				},
				deep: true,
				immediate: true,
			},
		},
		onShow() {
			this._loginHook_mixin()
		},
		mounted() {
			this.getLabelData();
		},
		methods: {
			reset() {
				this.currentItem = [];
				this.sourceData = [];
				this.$refs.CommonUpload._data.tempFileList = [];
				this.form = {
					feedbackContent: "", //反馈内容
					userPhone: "", //反馈者手机号
				};
			},
			filterCurrentItem() {
				return this.currentItem.map((item) => {
					return item.id;
				});
			},
			onSubmit() {
				if (
					this.$refs.CommonUpload._data.tempFileList.length !==
					this.sourceData.length
				) {
					this.$util.showToast({
						title: "请等待文件上传完毕再提交",
						icon: "none",
					});
					return;
				}
				const {
					nickName: userName
				} = uni.getStorageSync("userInfo");

				const params = {
					...this.form,
					userName,
					feedbackLabelIds: this.currentItem.map((item) => item.id).join(","),
				};
				if (!params.feedbackContent || !params.feedbackLabelIds) {
					this.$util.showToast({
						title: "请完成必填项再提交",
						icon: "none",
					});
					return;
				}
				if (params.userPhone) {
					if (
						!this.$util.checkMobile(params.userPhone) ||
						params.userPhone.length < 11
					) {
						this.$util.showToast({
							title: "手机号输入错误，请重新输入",
							icon: "none",
						});
						return;
					}
				}

				if (this.sourceData.length > 0) {
					let imageUrlArr = [];
					let videoUrlArr = [];
					this.sourceData.forEach((item) => {
						if (/.(gif|jpg|jpeg|png|gif|jpg|png)$/i.test(item)) {
							imageUrlArr.push(item);
						} else {
							videoUrlArr.push(item);
						}
					});
					params.imageUrl = imageUrlArr.join(",");
					params.videoUrl = videoUrlArr.join(",");
				}
				this.$requestData(apiConfig.submitFeedback, params).then((res) => {
					this.$util.showToast({
						title: "提交成功",
					});
					this.reset();
				});
			},
			getMore() {
				this.currentLabelData = this.labelData.slice(0, 19);
			},
			collapse() {
				this.currentLabelData = this.labelData.slice(0, 7);
			},
			itemClick(current, isExist) {
				if (isExist) {
					this.currentItem = this.currentItem.filter(
						(item) => item.id !== current.id
					);
				} else if (this.currentItem.length < 3) {
					this.currentItem.push(current);
				} else {
					this.$util.showToast({
						title: "问题类型最多只能选择3个",
						icon: "none",
					});
					return;
				}
			},
			getLabelData() {
				this.$requestData(apiConfig.getFeedbackLabel, {
					pageSize: 19,
					pageNum: 1,
				}).then((res) => {
					this.labelData = res.data.records;
					if (res.data.records.length >= 9) {
						this.currentLabelData = res.data.records.slice(0, 7);
					} else {
						this.currentLabelData = res.data.records.slice(0, 8);
					}
				});
			},
			imgDelete(data) {
				const {
					del,
					tempFilePaths
				} = data;
				if (del) {
					this.sourceData = this.sourceData.filter((item) => item !== del);
				}
			},
			beforeUpload() {
				// this.isCanSubmit = false;
			},
			uploadFail(err) {
				uni.hideLoading();
				this.$util.showToast({
					title: "文件太大,上传失败",
					icon: "none",
				});
			},
			uploadSuccess(res) {
				if (res) {
					var _res = JSON.parse(res.data);
					if (_res.code == 200) {
						this.sourceData.push(_res.data);
						this.$refs.uTips.show({
							title: "上传成功",
							type: "success",
							duration: "2300",
						});
					}
				}
			},
			uploadAllFinish() {
				// this.isCanSubmit = true;
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.issueFeedback {
		min-height: 100vh;
		background-color: #f7f7f7;

		.issueFeedback-card {
			background-color: #ffffff;
			margin-bottom: 20rpx;
			padding: 30rpx;

			.card-title {
				margin-bottom: 16rpx;
				display: flex;
				justify-content: space-between;
			}

			.card-describe {
				font-size: 28rpx;
				color: $common-grey-4;
			}
		}
	}
</style>
