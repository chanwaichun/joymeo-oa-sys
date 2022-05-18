<template>
	<view class="productReport common-container-bottom">
		<SearchInput class="productReport-searchInput" buttonName="搜索" placeholder="请输入搜索内容"
			@buttonClick="(customerName) => search(customerName)">
		</SearchInput>
		<u-cell-group v-if="productList.length" :border="false">
			<u-cell-item v-for="(item,index) in productList" :arrow="false"
				@click="linkAction({type:'productRegister',params:item})" :key="index">

				<view slot="title" class="max-width-400 word-break-all font-bold item-customerName">
					{{item.customerName}}
				</view>
				<view slot="label">最新登记:{{item.lastSignTime}}</view>
				<view slot="value">
					<view class="value-title ">货数累计:<text class="value-text font-bold">{{item.totalNum}}</text>
					</view>
					<view class="value-title ">货款累计:<text
							class="value-text font-bold">￥{{setPriceAbridge(item.totalPrice)}}
						</text>
					</view>
				</view>
			</u-cell-item>
		</u-cell-group>
		<!-- 空状态 -->
		<!-- 判斷是搜索詞之後的暫無數據還是不搜索就有的暫無數據 -->
		<EmptyPage type="report" :emptyText="isSearchByWord ? '暂无数据,建议您修改关键词重新搜索' : '当前没有货款报备的信息,请添加你的第一笔货款报备'" v-else-if="!isLoading"></EmptyPage>
		<fixed-btn>
			<u-button slot="right-button" style="width: 100%;" type="primary" shape="circle"
				@click="clickAction($event,'addInfo')">新增
			</u-button>
		</fixed-btn>
	</view>
</template>

<script>
	import apiConfig from '@/config/apiConfig.js'
	import util from '@/utils/util.js'
	import tabMixin from '@/mixins/tabMixin.js'
	import SearchInput from '@/components/SearchInput/SearchInput.vue'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	export default {
		components: {
			SearchInput,
			EmptyPage
		},
		mixins: [tabMixin],
		data() {
			return {
				isLoading:true,
				productList: [],
				customStyle: {
					width: '140rpx',
					height: '64rpx'
				},
				params: {
					customerName: '',
				},
				isSearchByWord: false,
				isCanUpdate: true,
				urlParams: null
			}
		},
		watch: {
			params: {

				handler(newVal, oldVal) {
					if (newVal.customerName !== '') {
						this.isSearchByWord = true
						return;
					}
					this.isSearchByWord = false
				},
				deep: true,
				immediate: true

			}
		},
		mounted() {
			this._tabComReachBottom_on_mixins(() => this.getProductList())
			this._tabComShow_on_mixins(() => {
				this.params.customerName = '';
				this.getProductList('search');
			})
		},
		destroyed() {
			// 取消reachBottom的监听以及页面show的监听
			this._tabComReachBottom_off_mixins();
			this._tabComShow_off_mixins()
		},
		methods: {
			setPriceAbridge(price) {
				return this.$util.setPriceAbridge(price);
			},
			getProductList(type) {
				// this.setLoading_loading_mixin(true)
				this.isLoading = true
				uni.showLoading({

					title: '数据加载中'
				})
				const {
					staffId
				} = uni.getStorageSync('userInfo')
				this.$requestData(apiConfig.productGetList, {
					...this.pageParams,
					...this.params,
					staffId
				}).then(({
					data
				}) => {
					this.isLoading = false
					// 没有数据直接
					if (!data) {
						this.isCanUpdate = false
					} else if (type === 'search') {
						this.isCanUpdate = true
						this.productList = data.records
					} else if (data.records.length) {
						this.isCanUpdate = true
						this.productList = this.productList.concat(data.records);
					} else {
						this.isCanUpdate = false
						uni.showToast({
							icon: 'none',
							title: '暂无更多数据',
							duration: 2000
						})
					}



					uni.hideLoading()

				})
			},
			// 搜索动作
			search(customerName) {
				this.params.customerName = customerName
				this.getProductList('search')
			},
			// 链接的动作
			linkAction(data) {
				const {
					params,
					type
				} = data
				// 货款登记页面
				if (type === 'productRegister') {
					let paramString = util.paramsObjectToString(params)
					uni.navigateTo({
						url: `/pages/product/productDetail${paramString}`
					})
				}
			},
			// 点击动作
			clickAction(e, type) {
				if (type === 'addInfo') {
					uni.navigateTo({
						url: `/pages/product/productRegister`
					})
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.productReport {
		padding-top: 20rpx;
		flex: 1;
		height: 100%;

		.item-customerName {
			color: $common-color-1;
			font-weight: bold;
		}

		.value-text {
			color: $common-color-2;
		}
	}
</style>
