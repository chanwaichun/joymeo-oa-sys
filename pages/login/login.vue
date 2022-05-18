<template>
	<view class="page-login">
		<view class="login-header">
			<view class="header-logo">
				<!-- <image mode="scaleToFill" src="../../static/image/logo标@2x.png"></image> -->
				<image mode="scaleToFill" src="https://static.joymeohis.com/wx/gongzonghao/image/logo.png"></image>
			</view>
		</view>
		<view class="login-body">
			<u-form :model="form" ref="uForm" label-width="200rpx" :error-type="['toast', 'border-bottom']">
				<u-form-item prop="mobile">
					<u-input v-model="form.mobile" type="number" placeholder="请输入手机号码" />
				</u-form-item>
				<u-form-item prop="code">
					<u-input v-model="form.code" type="number" placeholder="请输入验证码" />
					<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange">
					</u-verification-code>
					<u-button slot="right" shape="circle" type="primary" size="mini" @click="getCode">{{tips}}
					</u-button>
				</u-form-item>
			</u-form>

		</view>
		<view class="login-button">
			<u-button shape="circle" type="primary" @click="onSubmit">立即登录</u-button>
		</view>
		<view class="login-text">仅限于卓悦集团内部人员登录使用</view>
	</view>

</template>

<script>
	import apiConfig from '../../config/apiConfig.js'
	import formMixin from '../../mixins/formMixin.js'
	export default {
		// errorType: ['toast'],
		data() {
			return {
				// modalShow: false,
				tips: '',
				// 验证码倒计时
				seconds: 60,
				form: {
					// 手机号码
					mobile: '',
					// 验证码
					code: ''
				},
				imgData: '',
				rules: {
					mobile: [{
						required: true,
						message: '账号不能输入为空，请输入账号',
						trigger: ['change'],
					}, {
						validator: (rule, value, callback) => {
							return this.$util.checkMobile(value)
						},
						message: '请输入正确的手机号码',
						trigger: ['blur'],
					}],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: ['change', 'blur']
					}]
				},

			}
		},
		// mounted() {
		// 	this.modalShow = true;
		// },
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onShow() {
			// 隐藏首页
			wx.hideHomeButton && wx.hideHomeButton();
			const pages = getCurrentPages();
			const [currentPage] = pages;
			const {
				targetUrl
			} = currentPage.options;
			this.loginTarget = targetUrl;

		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				let mobile = this.form.mobile;
				// 验证是否有手机号码
				if (mobile) {
					// 如果可以发送验证码才执行
					if (this.$refs.uCode.canGetCode) {
						// 向后端请求验证码
						if (this.$util.checkMobile(mobile)) {
							uni.showLoading({
								title: '正在获取验证码'
							})

							this.$requestData(apiConfig.sendMessage, {
								mobile,
								itemName: 'BD'
							}).then((res) => {
								// 请求没有东西 说明不是200返回
								if (res) {
									uni.hideLoading();
									this.$u.toast('验证码已发送');
									this.$refs.uCode.start();
								}
							})
						} else {
							this.$u.toast('请输入正确的手机号码');
						}

					} else {
						this.$u.toast('倒计时结束后再重新发送');
					}
				} else {
					this.$u.toast('请输入手机号码');
				}

			},
			onSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.formSubmit()
					}
				})
			},
			// 提交登录表单
			formSubmit() {
				uni.showLoading({
					title: '登录中'
				})
				this.$requestData(apiConfig.login, {
					loginType: "MOBILE_CODE",
					code: this.form.code,
					mobile: this.form.mobile,
					merchantType:'ZYJK'
				}).then((res) => {
					const {
						data
					} = res
					if (res) {
						uni.hideLoading()
						uni.showToast({
							title: '登录成功',
							duration: 2000
						});

						// uni.setStorageSync('isLogin', true);
						uni.setStorageSync('userInfo', data);
						uni.setStorageSync('token', data.token)
						uni.reLaunch({
							url: `${this.loginTarget}`
						})
					}
				})


			}
		}

	}
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.page-login {
		min-height: 100vh;
	}

	.login-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300rpx;

		.header-logo {
			width: 200rpx;
			height: 120rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	.login-body {
		padding: 0 55rpx;
	}

	.login-button {
		padding: 55rpx;
	}

	.login-text {
		color: $common-grey-4; 
		font-size: 24rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		padding-bottom: 32rpx;
	}
</style>
