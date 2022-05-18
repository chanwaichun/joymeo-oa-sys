<template>
	<view class="page-empty u-flex u-col-center u-row-center" :class="emptyType">
		<u-empty :text="emptyText" mode="list"></u-empty>
	</view>
</template>

<script>
	export default {
		name: "PageEmpty",
		props: {
			emptyType: {
				type: String,
				default: 'page'
			},
			emptyText:{
				type: String,
				default: '暂无数据'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.page-empty.page {
		width: 100%;
		height: 100vh;

	}

	.page-empty.card {
		width: 100%;
		height: 65vh;

	}.page-empty.miniCard {
		width: 100%;
		height: 300rpx;

	}
	.page-empty.smallCard
	{
		width: 100%;
		height: 500rpx;
	}
</style>
