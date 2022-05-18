<template>
	<view class="taskVisitList">
		<view class="taskList" v-if="taskList && taskList.length > 0">
			<view class="taskList-item u-flex u-row-between" v-for="(item,index) in taskList" :key="index">
				<view class="item-title max-width-400 word-break-all">{{item.title}}</view>
				<u-button slot="right-icon" size="mini" shape="circle" type="primary" @click="$emit('itemClick',item)">
					执行任务
				</u-button>
			</view>

		</view>
		<EmptyPage emptyText="暂无可执行任务" v-else></EmptyPage>
	</view>
</template>

<script>
	export default {
		props: {
			taskList: {
				type: Array,
				default: []
			}
		}
	}
</script>

<style>
</style>
