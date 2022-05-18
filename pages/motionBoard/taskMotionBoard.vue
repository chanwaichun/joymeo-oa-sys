<template>
	<view class="taskMotionBoard">
		<view class="taskMotionBoard-calendar">
			<Calendar :defaultTime="currentTime" :spot="[$util.getCommonTime(currentTime, '-')]"
				@onChange="dateChange()" :isShowSpot="isShowSpot"></Calendar>
		</view>

		<u-tabs bgColor="none" activeColor="#1D4393" inactiveColor="#000000" :list="tabList" :is-scroll="false"
			:current="current" @change="tabChange"></u-tabs>
		<TaskList :current="current" :taskList="taskList" @itemClick="itemClick"></TaskList>
	</view>

</template>

<script>
	import Calendar from "@/components/Calendar/Calendar.vue"
	import TaskList from "@/pages/motionBoard/components/TaskList.vue"
	import tabMixin from "@/mixins/tabMixin.js"
	import apiConfig from '@/config/apiConfig.js'
	import loginMixin from '@/mixins/loginMixin.js'
	export default {
		mixins: [tabMixin, loginMixin],
		components: {
			Calendar,
			TaskList
		},
		data() {
			return {
				isCanUpdate: true,
				pageParams: {
					pageNum: 1,
					pageSize: 10
				},
				tabList: [{
						name: "待完成",
					},
					{
						name: "已完成",
					}
				],
				currentTime: this.$util.getCommonTime(this.$moment(), '-'),
				isShowSpot: false,
				taskList: [],
				current: 0
			};
		},
		onReachBottom() {
			this._tabPageReachBottom_on_mixins(() => {
				this.getTaskBoard(this.current)
			})
		},
		onShow() {
			this._loginHook_mixin()

		},
		methods: {
			_loginSuccess_mixin() {
				this.reset()
				this.getTaskBoard(this.current)

			},
			itemClick(item) {
				if (item.executeStatus !== 'FINISH') {
					const {
						staffId
					} = uni.getStorageSync('userInfo')
					const {
						ttid,
						ttrId,
						taskTemType
					} = item
					const params = {
						ttid,
						ttrId,
						taskTemType,
						// targetId: staffId,
						// targetName: `${uni.getStorageSync("userInfo").nickName}`
					}

					uni.navigateTo({
						url: `/pages/attence/taskMicroControl${this.$util.paramsObjectToString(params)}`
					})
				}
			},
			reset() {
				this.taskList = []

				if (this.current === 0) {
					this.isCanUpdate = false
				} else {
					this.isCanUpdate = true
				}

				this.pageParams = {
					pageSize: 10,
					pageNum: 1
				}
			},
			dateChange(selectDay) {
				this.isShowSpot = false
				this.current = 0
				this.reset();
				this.currentTime = selectDay.dateString
				this.getTaskBoard(this.current)
			},
			getTaskBoard(index) {

				uni.showLoading({
					title: '任务列表加载中'
				})
				const {
					staffId
				} = uni.getStorageSync("userInfo");
				let params = index === 0 ? {
					time: this.currentTime,
					taskTargets: 'SALE,OPERATE',
					// targetId: staffId
					// taskTargets: 'CLINIC',
				} : {
					...this.pageParams
				}
				this.$requestData(apiConfig[index === 0 ? 'getTaskBoardCurrent' : 'getTaskBoardFinished'], {
					...params
				}).then((res) => {
					uni.hideLoading()
					if (index === 0) {
						if (res.data.length > 0) {
							this.isShowSpot = true;
						}
						this.taskList = res.data
					} else {
						const {
							data: {
								records
							}
						} = res
						this._tabReachBottom_dataUpadte_mixins(this.taskList, records).then((data) => {
							this.taskList = data
						})
					}


				})
			},
			tabChange(index) {
				this.current = index
				this.reset()
				this.getTaskBoard(index);
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.taskMotionBoard {
		min-height: 100vh;
		background-color: $common-grey-2;

		.taskMotionBoard-calendar {
			padding: 20rpx 20rpx 0rpx 20rpx;
		}
	}
</style>
