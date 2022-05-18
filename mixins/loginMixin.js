// 登录可复用的hooks
const loginMixin = {
	methods: {
		_loginHook_mixin() {
			const token = uni.getStorageSync("token");
			this.$util.getRigonData(null, false);
			// 用户进入这个hook的时候就开始无感知的请求地区表
			if (token) {
				this._loginSuccess_mixin && this._loginSuccess_mixin();
				// wx.hideHomeButton && wx.hideHomeButton();
			} else {
				// 跳转到登录页
				this.$util.showToast({
					title: "当前用户未登录,请登录",
					duration: 2000,
					icon: "none",
				});
				this.$util.reLaunchToLoginPage();
			}
		},
		_loginSuccess_mixin() {},
	},
};
export default loginMixin;
