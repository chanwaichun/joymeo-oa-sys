<template>
	<view class="test">
		<!-- <u-button @click="show = true">asdasdsadasd</u-button>
		<CommonCascader v-model="show" :fieldNames="{label:'text',value:'value',children:'children'}"
			:options="regionData"></CommonCascader>
		<view ></view> -->
		<ChartFunnel canvasId="qweqweewqeqweqwe231231232"></ChartFunnel>
	</view>

</template>

<script>
	import CapsuleTab from '../../components/CapsuleTab/CapsuleTab.vue'
	import Calendar from '../../components/Calendar/Calendar.vue'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	import CommonImage from '@/components/CommonImage/CommonImage.vue'
	import CommonCascader from '@/components/CommonCascader/Index.vue'
	import ChartFunnel from '@/dashBoardComponents/ChartFunnel/Index.vue'
	// import CommonNumberBox from '@/components/CommonImage/CommonNumberBox.vue'
	export default {
		
		components: {
			'CapsuleTab': CapsuleTab,
			Calendar,
			EmptyPage,
			CommonImage,
			CommonCascader,
			ChartFunnel
		},
		mounted() {},
		data() {
			return {
				show: false,
				regionObj: {},
				regionData: [],

			};
		},
		methods: {
			setDataByLevel(data) {
				const q = data
				const obj = {}
				while (q.length > 0) {
					const n = q.shift();
					obj[n.value] = n.children
					n.children.forEach(item => {
						q.push(item)
					})
				}
				// console.log(obj)
				return obj

			},
			itemClick(item, index) {
				console.log(this.regionObj[item.value])
			}
		}
	}
</script>

<style lang="scss">
	.test {
		height: 100vh;
	}
</style>
