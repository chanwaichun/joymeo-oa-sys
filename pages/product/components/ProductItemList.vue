<template>
	  <!-- 判斷是搜索詞之後的暫無數據還是不搜索就有的暫無數據 -->
	<EmptyPage v-if="drugList.length === 0" :emptyText="isSearchByWord ? '暂无数据,建议您修改关键词重新搜索' : '暂无数据'">
	</EmptyPage>
	<view v-else class="productItemList">
		<view class="productItemList-item" v-for="(item, index) in drugList" :key="index">
			<view class="item-container" @click="linkAction({ type: 'productRegisterDetail', params: item })">
				<CommonImage width="300rpx" height="300rpx" :src="item.productImg"></CommonImage>
				<view class="container-text">{{ item.productName }}</view>
				<view class="container-company">{{ item.factoryCompany }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import EmptyPage from "@/pages/product/components/EmptyPage.vue";
	import CommonImage from "@/components/CommonImage/CommonImage.vue";
	export default {
		components: {
			EmptyPage,
			CommonImage,
		},
		props: {
			drugList: {
				type: Array,
				default: [],
			},
			isSearchByWord: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				urlParams: {},
			};
		},
		mounted() {
			this.urlParams = this.$util.getUrlParams();
		},
		methods: {
			linkAction(data) {
				let {
					type,
					params
				} = data;
				if (this.urlParams.customerId) {
					params = {
						...params,
						customerId: this.urlParams.customerId,
						customerName: this.urlParams.customerName,
					};
				}
				// 从货品列表页跳转到货品详情
				if (type === "productRegisterDetail") {
					uni.navigateTo({
						url: `/pages/product/productRegisterDetail?data=${JSON.stringify(
            params
          )}`,
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import "@/common/common.scss";

	.productItemList {
		padding: 10rpx 10rpx 0rpx 10rpx;
		display: flex;
		flex-wrap: wrap;

		.productItemList-item {
			padding: 10rpx;
			width: 50%;

			.item-container {
				display: flex;
				flex-direction: column;

				padding: 0rpx 10rpx 40rpx 10rpx;

				.container-text {
					color: $common-color-3;
					font-size: 32rpx;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-bottom: 8rpx;
				}

				.container-company {
					color: $common-grey-1;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
