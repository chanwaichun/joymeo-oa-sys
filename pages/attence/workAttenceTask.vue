<template>
	<view class="workAttenceTask">
		<!-- <view class="workAttenceTask-data">
			数据概览
		</view> -->
		<!-- <u-tabs activeColor="#4975C0" :list="tabList" :is-scroll="false" :current="current" @change="tabChange">
		</u-tabs> -->
		<TaskVisitList :taskList="taskList" @itemClick="(item)=>clickAction(item)" v-if="taskList.length > 0 ">
		</TaskVisitList>
		<EmptyPage emptyText="暂无可执行任务" v-else></EmptyPage>
		<!-- <view v-if="current === 0">
			数据分析
		</view>
		<TaskVisitList :taskList="taskList" @itemClick="(item)=>clickAction(item)" v-else></TaskVisitList> -->
		<!-- 	<view >
			<view class="taskList" v-if="taskList && taskList.length > 0">
				<view class="taskList-item u-flex u-row-between" v-for="(item,index) in taskList" :key="index">
					<view class="item-title max-width-400 word-break-all">{{item.title}}</view>
					<u-button slot="right-icon" size="mini" shape="circle" type="primary" @click="clickAction(item)">
						执行任务
					</u-button>
				</view>

			</view>
			<EmptyPage emptyText="暂无可执行任务" v-else></EmptyPage>
		</view> -->


	</view>
</template>

<script>
	import apiConfig from '../../config/apiConfig.js'
	// import tabMixin from '@/mixins/tabMixin.js'
	import TaskVisitList from './tabComponents/TaskVisitList.vue'
	import TaskDataAnalyse from './tabComponents/TaskDataAnalyse.vue'
	import EmptyPage from '@/pages/product/components/EmptyPage.vue'
	export default {
		// mixins: [tabMixin],
		components: {
			EmptyPage,
			TaskVisitList,
			TaskDataAnalyse
		},
		data() {
			return {
				tabList: [{
					name: "数据分析"

				}, {
					name: "拜访任务"
				}],
				urlParams: {},
				pageParams: {
					pageSize: 10,
					pageNum: 1
				},
				isCanUpdate: true,
				current: 0,
				taskList: []
			}
		},
		// onReachBottom() {
		// 	_tabPageReachBottom_on_mixins(() => {
		// 		this.getSalesTaskList()
		// 	})
		// },
		onShow() {
			this.urlParams = this.$util.getUrlParams();
			this.taskList = []

			this.getSalesTaskList()
		},
		methods: {

			getSalesTaskList() {

				const params = {
					// ...this.pageParams,
					taskTargets: 'CLINIC',
					targetId: this.urlParams.cid
					// cid: this.urlParams.cid
				}
				uni.showLoading({
					title: "任务列表加载中"
				})
				this.$requestData(apiConfig.getTaskBoardCurrent, params).then((res) => {
					uni.hideLoading();
					this.taskList = res.data
					// this._tabReachBottom_dataUpadte_mixins(this.taskList, res.data.records).then((data) => {
					// 	console.log(data)
					// 	this.taskList = data
					// })


				})
			},
			clickAction(item) {
				const {
					ttid,
					ttrId,
					taskTemType
				} = item
				const params = {
					ttid,
					ttrId,
					taskTemType,
					targetId: this.urlParams.cid,
					targetName: this.urlParams.clinicName
				}
				uni.navigateTo({
					url: `/pages/attence/taskMicroControl${this.$util.paramsObjectToString(params)}`
				})
			},
			tabChange(index) {

				this.current = index;
			}
		}

	}
</script>

<style lang="scss">
	.taskList {
		.taskList-item {
			padding: 32rpx;
			border-bottom: 1px solid #F4F4F4;
		}
	}

	.cell-item {
		border-bottom: 1px solid #F4F4F4;
	}
</style>
