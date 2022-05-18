<template>
	<view></view>
</template>

<script>
	import loginMixin from '@/mixins/loginMixin.js'
	import tabMixin from '@/mixins/tabMixin.js'
	import apiConfig from '@/config/apiConfig.js'
	import {
		allRequestCancel
	} from '@/http/httpCancel.js'



	export default {
		mixins: [loginMixin, tabMixin],
		data() {
			return {
				recordId: null,
			}
		},
		onShow() {
			this._loginHook_mixin();
		},
		methods: {
			_loginSuccess_mixin() {
				this.setBrowsePage();
				// if (this.currentPage.key === 'General') {
				// 	getApp().globalData.filter = this.setfilterByCurrentPage(this.currentPage)
				// }
				uni.reLaunch({
					url:'/pagesB/hisDaily/index'
				})
			},
			// 设置进入后记录
			setBrowsePage() {
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.setBrowsePage, {
					staffId
				}).then((res) => {
					this.recordId = res.data
					getApp().globalData.recordId = res.data
				})
			},
			// 设置离开后记录
			// setLeavePage() {
			// 	if (this.recordId) {
			// 		// debugger;
			// 		this.$requestData(apiConfig.setLeavePage, {
			// 			recordId: this.recordId
			// 		})
			// 	}
			// },
		}
	}
</script>
