<template>

	<PlanDetail :planDetailList="planDetailList" :total="urlParams.submitNum" :isToDetail="false">
	</PlanDetail>
	
</template>

<script>
	import apiConfig from '@/config/apiConfig.js'
	import tabMixin from '@/mixins/tabMixin.js'
	import PlanDetail from "@/pages/product/components/PlanDetail.vue"
	export default {
		mixins: [tabMixin],
		components: {
			PlanDetail
		},
		data() {
			return {
				isCanUpdate: true,
				pageParams: {
					pageNum: 1,
					pageSize: 10
				},
				planDetailList: [],
				isLoading: true,
				urlParams: null
			};
		},
		onReachBottom() {
			this._tabPageReachBottom_on_mixins(() => {
				this.getPlanHistoryDetail();
			})
		},
		mounted() {
			this.urlParams = this.$util.getUrlParams();
			this.getPlanHistoryDetail();
		},
		methods: {
			getPlanHistoryDetail() {
				this.isLoading = true;
				uni.showLoading({
					title: '数据加载中'
				})
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.getPlanHistoryDetail, {
					staffId,
					planId: this.urlParams.planId,
					...this.pageParams
				}).then(res => {
					this.isLoading = false;
					uni.hideLoading();
					if (res.data.records.length > 0) {
						this.planDetailList = this.planDetailList.concat(res.data.records);
					} else {
						this.isCanUpdate = false
						this.$util.showToast({
							title: '暂无更多数据',
							icon: 'none'
						})
					}

					// console.log(res)
				})
			}
		}

	}
</script>

<style lang="scss">

</style>
