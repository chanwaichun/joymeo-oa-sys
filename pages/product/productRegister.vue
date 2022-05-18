<template>
	<view class="productRegister">
		<view class="productRegister-header fixed-top">
			<SearchInput buttonName="搜索名称" placeholder="请输入搜索内容"
				@buttonClick="(keyword) => clickAction('search', { keyword })">
			</SearchInput>
			<u-tabs bgColor="#FFFFFF" activeColor="#1D4393" inactiveColor="#000000" :list="tabList" :is-scroll="false"
				:current="current" @change="tabChange"></u-tabs>
		</view>
		<view class="productRegister-page">
			<ProductItemList :isSearchByWord="isSearchByWord" :drugList="drugList"></ProductItemList>
		</view>
	</view>
</template>

<script>
	import apiConfig from "../../config/apiConfig.js";
	import tabMixin from "@/mixins/tabMixin.js";
	import util from "../../utils/util.js";
	import ProductItemList from "@/pages/product/components/ProductItemList.vue";
	export default {
		mixins: [tabMixin],
		components: {
			ProductItemList,
		},
		data() {
			return {
				drugList: [],
				isCanUpdate: true,
				pageParams: {
					pageNum: 1,
					pageSize: 10,
				},
				isSearchByWord: false,
				tabList: [{
						name: "卓悦产品",
					},
					{
						name: "产品",
					},
				],
				current: 0,
				urlParams: {},
			};
		},
		mounted() {
			this.resetData();
			this.fetchByTabIndex(this.current);
		},
		// 触发跳转钩子
		onReachBottom() {
			this._tabPageReachBottom_on_mixins(() => {
				this.fetchByTabIndex(this.current);
			});
		},
		onShow() {
			this.urlParams = this.$util.getUrlParams();
		},
		methods: {
			tabChange(index) {
				this.current = index;
				this.resetData();
				this.fetchByTabIndex(index);
			},
			fetchByTabIndex(index, type = null) {
				if (index === 0) {
					this.getDrugByApi("getJoymeoDrugList", type);
					return;
				}
				this.getDrugByApi("getDrugList", type);
			},
			// 重置参数
			resetData() {
				this.drugList = [];
				this.pageParams.pageNum = 1;
				this.isCanUpdate = true;
			},
			getDrugByApi(api, type) {
				this.isLoading = true
				uni.showLoading({
					title: "药品列表加载中",
				});
				this.$requestData(apiConfig[api], this.pageParams).then(({
					data
				}) => {
					this.isLoading = false
					uni.hideLoading();
					if (data.records.length > 0) {
						this.drugList = this.drugList.concat(
							data.records.map((item) => ({
								productImg: item.hasOwnProperty("productImgDTOS") ?
									item.productImgDTOS[0] && item.productImgDTOS[0].imgUrl :
									"",
								...item,
							}))
						);
					} else {
						this.isCanUpdate = false;
						wx.showToast({
							title: type === "search" ? "没有找到匹配的结果" : "暂无更多数据",
							duration: 2000,
							icon: "none",
						});
					}
				});
			},
			// getDrugList(type) {
			// 	uni.showLoading({
			// 		title: '药品列表加载中'
			// 	})
			// 	this.$requestData(apiConfig.drugGetList, this.pageParams).then(({
			// 		data
			// 	}) => {
			// 		uni.hideLoading()
			// 		if (data.records.length > 0) {
			// 			this.drugList = this.drugList.concat(data.records);
			// 		} else {
			// 			this.isCanUpdate = false
			// 			wx.showToast({
			// 				title: type === 'search' ? '没有找到匹配的结果' : '暂无更多数据',
			// 				duration: 2000,
			// 				icon: "none"
			// 			})
			// 		}
			// 	})
			// },

			clickAction(type, params) {
				if (type === "search") {
					const {
						keyword
					} = params;
					this.resetData();
					if (this.current === 0) {
						this.pageParams = {
							...this.pageParams,
							productName: keyword,
						};
					} else {
						this.pageParams = {
							...this.pageParams,
							keyword,
						};
					}
					if (keyword.length > 0) {
						this.isSearchByWord = true;
					} else {
						this.isSearchByWord = false;
					}
					this.fetchByTabIndex(this.current, "search");
				}
			},
		},
	};
</script>

<style lang="scss">
	.productRegister-header {
		padding-top: 20rpx;
		background-color: #ffffff;
	}

	.page-productRegister {}

	.search-input {
		padding: 0rpx 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.input-container {
			width: 530rpx;
		}
	}

	.productRegister-page {
		padding-top: 180rpx;

		.grid-text {
			overflow: hidden;
			text-overflow: ellipsis; // text-overflow css3的属性，当文本溢出时，显示省略号
			display: -webkit-box;
			-webkit-line-clamp: 2; // 设置两行文字溢出
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
