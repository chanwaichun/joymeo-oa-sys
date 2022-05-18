<template>
	<view class="search-input">
		<view class="input-container">
			<!-- <u-input v-model="searchName" :maxlength="maxlength" placeholder="请输入客户名称" /> -->
			<u-search searchIconColor="#CCCCCC" :show="false" :showAction="false" :placeholder="placeholder" v-model="searchName">
			</u-search>
		</view>
		<view class="input-button" :style="{backgroundColor:buttonBackground}" @click="buttonClick">
			{{buttonName}}
		</view>
		<!-- 		<u-button :custom-style="{width: '140rpx',height: '64rpx'}" shape="circle" size="mini" type="primary"
			></u-button> -->
	</view>
</template>

<script>
	export default {
		name: "SearchInput",
		props: {
			maxlength: {
				type: Number,
				default: 250
			},
			buttonName: {
				type: String,
				default: '搜索'
			},
			placeholder: {
				type: String,
				default: '请输入内容'
			},
			buttonBackground: {
				type: String,
				default: "#4975C0"
			}
		},
		data() {
			return {
				searchName: ''
			};
		},
		methods: {
			buttonClick() {
				this.$emit('buttonClick', this.searchName);
			}
		}
	}
</script>

<style lang="scss">
	.search-input {
		padding: 0rpx 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.input-container {
			width: 530rpx;

		}
		.input-button
		{
			white-space: nowrap;
			color: #FFFFFF;
			height: 64rpx;
			width: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 32rpx;
		}
	}
</style>
