<template>
	<u-popup v-model="show" mode="bottom">
		<slot></slot>
		<view class="filter-button">
			<u-button>重置</u-button>
			<u-button type="primary">确定</u-button>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: "FilterPopup",
		props: {
			modelValue: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				show: true
			};
		},
		mounted() {
			console.log(this);
		}

	}
</script>

<style lang="scss">

</style>
