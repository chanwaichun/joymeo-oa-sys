<template>
	<view class="attenceList">
		<view v-for="(item,index) in data " class="attenceList-item">
			{{index}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: () => []
			}
		},

	}
</script>

<style>
</style>
