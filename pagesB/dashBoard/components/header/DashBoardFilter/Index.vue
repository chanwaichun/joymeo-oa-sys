<template>
	<!-- 上方筛选框 -->
	<view class="dashBoardFilter">

		<view class="dashBoardFilter-container-icon" @click="showSelect" v-if="currentPage.key !== 'General'">
			<image class="container-icon"
				src="https://joymeo-wx-gongzonghao.oss-cn-guangzhou.aliyuncs.com/wx/gongzonghao/image/icon_filter.png">
			</image>
		</view>
		<uni-data-picker v-if="currentPage.type==='BD' || currentPage.type==='OTC'" placeholder="请选择地址" v-model="deptId"
			:isCanSelect="true" :isOpen="deptSelectShow" :isShowText="false" :preload="true" :border="false"
			popup-title="请选择" :currentdata="currentDept" :localdata="deptData" zIndex="999" @change="deptChange"
			@popupclosed="deptModalClosed">
		</uni-data-picker>
		<uni-data-picker v-if="currentPage.type==='HIS'|| currentPage.type==='OTC'" placeholder="请选择地址"
			v-model="regionId" :isCanSelect="true" :isOpen="regionSelectShow" :isShowText="false" :preload="true"
			:border="false" popup-title="请选择" :currentdata="currentRegion" :localdata="regionData" zIndex="999"
			@change="regionChange" @popupclosed="regionModalClosed">
		</uni-data-picker>
		<uni-data-picker v-if="currentPage.type==='OTC'" placeholder="请选择客户分类" v-model="classifyId" :isCanSelect="true"
			:isOpen="classifySelectShow" :isShowText="false" :preload="true" :border="false" popup-title="请选择"
			:currentdata="currentClassify" :localdata="classifyData" zIndex="999" @change="classifyChange"
			@popupclosed="classifyModalClosed">
		</uni-data-picker>
		<u-select v-model="drugSelectShow" :list="drugData" value-name="id" label-name="productName"
			@columnChange="columnChange" @confirm="drugConfirm"></u-select>

		<u-calendar v-model="calendarShow" mode="range" @change="dateChange"></u-calendar>
		<u-popup v-model="show" mode="right" width="100%" duration="0" :z-index="500">

			<view class="dashBoardFilter-menuList u-flex u-flex-col u-row-between">

				<scroll-view :scroll-y="true" class="menuList-filter">
					<view class="menuList-header">
						<image class="container-icon" @click="show = false"
							src="https://joymeo-wx-gongzonghao.oss-cn-guangzhou.aliyuncs.com/wx/gongzonghao/image/icon_filter_solid.png">
						</image>
					</view>
					<view class="filter-time">
						<view class="filter-title">时间筛选</view>
						<Filter type="time" :currentKey="currentFilter.timeKey" :currentPage="currentPage"
							:currentTime="currentTime" :selectList="timeList" @itemClick="timeItemClick"
							@customClick="timeCustomClick">
						</Filter>
						<view></view>
					</view>
					<view class="filter-dept" v-if="currentPage.type==='BD'|| currentPage.type==='OTC'">
						<view class="filter-title">组织</view>
						<Filter type="dept" :currentKey="currentFilter.deptKey" :currentDept="currentDept"
							:selectList="deptList" @itemClick="deptItemClick" @customClick="deptCustomClick">
						</Filter>
						<!-- <view @click="deptCustomClick">22222222{{currentDept.map(item=>{
							return item.text
						}).join('-')}}</view> -->

					</view>
					<view class="filter-region" v-if="currentPage.type==='HIS'|| currentPage.type==='OTC'">
						<view class="filter-title">区域</view>
						<Filter type="region" :currentKey="currentFilter.regionKey" :currentRegion="currentRegion"
							:selectList="regionList" @itemClick="regionItemClick" @customClick="regionCustomClick">
						</Filter>
						<!-- <view @click="deptCustomClick">22222222{{currentDept.map(item=>{
							return item.text
						}).join('-')}}</view> -->

					</view>
					<view class="filter-drugs" v-if="currentPage.type==='OTC'">
						<view class="filter-title">药品</view>
						<Filter type="drug" :currentKey="currentFilter.drugKey" :currentDrug="currentDrug"
							:selectList="drugList" @itemClick="drugItemClick" @customClick="drugCustomClick">
						</Filter>
					</view>

					<view class="filter-classify" v-if="currentPage.type==='OTC'">
						<view class="filter-title">分类</view>
						<Filter type="classify" :currentKey="currentFilter.classifyKey"
							:currentClassify="currentClassify" :selectList="classifyList" @itemClick="classifyItemClick"
							@customClick="classifyCustomClick">
						</Filter>
					</view>
				</scroll-view>
				<view class="menuList-button u-flex">
					<u-button slot="right" class="button-item" shape="circle" :plain="true" type="primary"
						throttle-time="10" @click="reset">重置
					</u-button>
					<u-button throttle-time="10" slot="right" class="button-item" shape="circle" type="primary"
						@click="contentFilter">确定
					</u-button>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import Filter from './Filter.vue'
	import selectList from './config/selectList.js'
	import apiConfig from '@/config/apiConfig.js'
	export default {
		components: {
			Filter
		},
		props: {
			currentPage: {
				type: Object,
				default () {
					return {}
				}
			},
			propsFilter: {
				type: Object,
				default () {
					return {}
				}
			},
			currentFilter: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				...selectList,
				filter: this.propsFilter,
				// 部门筛选
				deptData: [],
				deptId: null,
				//时间选择
				currentTime: '',
				currentDept: [],
				// 药品筛选
				drugData: [],
				drugId: null,
				currentDrug: [],
				// 分类筛选
				classifyData: [],
				classifyId: null,
				currentClassify: [],
				// 辖区分类
				currentRegion: [],
				regionData: [],
				regionId: null,
				//弹窗显示状态
				show: false,
				drugSelectShow: false,
				deptSelectShow: false,
				regionSelectShow: false,
				classifySelectShow: false,
				calendarShow: false,
				drugUpdate: true,
				drugPageParams: {
					pageSize: 10,
					pageNum: 1
				}
			}
		},
		mounted() {
			this.minDate = this.$moment().sub(120, 'DD').format('YYYY-MM-DD');
			this.getDeptData();
			this.getJoymeoDrugList();
			this.getCustomerClassifyVoTree();
			this.$util.getRigonData((data) => {
				this.regionData = data
				// this.getCustomerDetailByParams()
			}, true)
			// 订阅这个请求，如果拿到数据就立马赋值
			uni.$on('onGetRigonData', (data) => {
				this.regionData = data
				// this.getCustomerDetailByParams()
			});
		},
		methods: {
			DFSTranslateData(data, keyGroup) {
				/*
				*key:{
					*children:'adminStructureVos' ,
					* text:'deptName',
					* value:'id'
					* 
				}
				* 
				* 
				* 
				*/
				let newData = data.map(item => {
					if (item.hasOwnProperty(keyGroup.children)) {
						return {
							text: item[keyGroup.text],
							value: item[keyGroup.value],
							children: this.DFSTranslateData(item[keyGroup.children], keyGroup)
						}
					} else {
						return {
							text: item[keyGroup.text],
							value: item[keyGroup.value],

						}
					}

				})
				return newData
			},
			getDeptData() {
				this.$requestData(apiConfig.getDeptData, {
					deptParentId: '1'
				}).then((res) => {
					let data = this.DFSTranslateData(res.data, {
						children: 'adminStructureVos',
						text: 'deptName',
						value: 'id'

					})
					this.deptData = data;
				})
			},
			getJoymeoDrugList() {
				if (this.drugUpdate) {
					uni.showLoading({
						title: '药品加载中'
					});
					this.$requestData(apiConfig.getJoymeoDrugList, this.drugPageParams).then((res) => {
						uni.hideLoading();
						if (res.data.records.length < this.drugPageParams.pageSize) {
							this.drugUpdate = false
						}
						this.drugData = [...this.drugData, ...res.data.records];
					})
				}

			},
			getCustomerClassifyVoTree() {
				this.$requestData(apiConfig.getCustomerClassifyVoTree, {}).then((res) => {
					let data = this.DFSTranslateData(res.data, {
						children: 'customerClassifyVos',
						text: 'classifyName',
						value: 'id'
					})
					this.classifyData = data;
				})
			},
			reset() {
				// getApp().globalData.filter = {
				// 	timeType: 'today',
				// 	deptType: 'current'
				// }
				this.$emit('resetFilter')
			},
			contentFilter() {
				this.show = false;
				let filter = this.$dashBoardUtil.formatFilter({
					currentDeptKey: this.currentFilter.deptKey,
					currentTimeKey: this.currentFilter.timeKey,
					currentRegionKey: this.currentFilter.regionKey,
					currentDrugKey: this.currentFilter.drugKey,
					currentClassifyKey: this.currentFilter.classifyKey,

				}, {
					deptId: this.deptId,
					currentTime: this.currentTime,
					currentRegion: this.currentRegion,
					currentDrug: this.currentDrug,
					currentClassify: this.currentClassify
				}, this.currentPage)
				getApp().globalData.filter = filter
				// this.$emit('setFilter', filter)
				uni.$emit('contentFilter', filter);
				uni.$emit('rankFilter', filter);
			},
			showSelect() {
				this.show = !this.show
			},
			// 日历切换
			dateChange(calendarDate) {
				const {
					endDate,
					startDate
				} = calendarDate
				const diff = this.$moment().distance(endDate, startDate)
				const diffDay = Number(this.$util.translateTimeByUnit(diff, 'day') + 1)
				if (diffDay > 120) {

					this.calendarShow = true;
					this.$util.showToast({
						title: '时间跨度不能超过120天',
						icon: 'none'
					})
				} else {
					this.currentTime = `${startDate} - ${endDate}`
					// this.$emit('setCurrentTimeKey', 'custom')
					this.setCurrentFilterByType('timeKey', 'custom');
				}
			},
			// 自定义按钮点击
			timeCustomClick() {
				this.calendarShow = true;
			},
			// 时间点击
			timeItemClick(item) {
				const {
					key
				} = item
				// this.$emit('setCurrentTimeKey', key)
				this.setCurrentFilterByType('timeKey', key);

			},
			// 部门自定义点击
			deptCustomClick(item) {
				this.deptSelectShow = true;
			},
			// 部门筛选框隐藏
			deptModalClosed() {
				this.deptSelectShow = false;
			},
			// 部门切换
			deptChange(e) {
				const {
					detail: {
						value
					}
				} = e
				this.currentDept = value
				// this.currentDeptKey = 'custom'
				// this.$emit('setCurrentDeptKey', 'custom')
				this.setCurrentFilterByType('deptKey', 'custom');
			},
			// 部门点击
			deptItemClick(item) {
				const {
					key
				} = item
				// this.currentDeptKey = key
				// this.$emit('setCurrentDeptKey', key)
				this.setCurrentFilterByType('deptKey', key);
			},
			regionItemClick(item) {
				const {
					key
				} = item
				this.setCurrentFilterByType('regionKey', key);
			},
			regionCustomClick(item) {
				this.regionSelectShow = true;
			},
			regionChange(e) {
				const {
					detail: {
						value
					}
				} = e
				this.currentRegion = value
				// this.currentDeptKey = 'custom'
				// this.$emit('setCurrentRegionKey', 'custom')
				this.setCurrentFilterByType('regionKey', 'custom');
			},
			// 部门筛选框隐藏
			regionModalClosed() {
				this.regionSelectShow = false;
			},
			classifyItemClick(item) {
				const {
					key
				} = item
				// this.currentDeptKey = key
				// this.$emit('setCurrentDeptKey', key)
				this.setCurrentFilterByType('classifyKey', key);
			},
			classifyCustomClick(item) {
				this.classifySelectShow = true
			},
			classifyChange(e) {
				const {
					detail: {
						value
					}
				} = e
				this.currentClassify = value
				// this.currentDeptKey = 'custom'
				// this.$emit('setCurrentRegionKey', 'custom')
				this.setCurrentFilterByType('classifyKey', 'custom');
			},
			classifyModalClosed() {
				this.classifySelectShow = false
			},
			columnChange(value) {
				// console.log(value);
				const [currentIndex] = value;
				if (this.drugUpdate && currentIndex >= this.drugData.length - 4) {
					this.drugPageParams.pageNum += 1
					this.getJoymeoDrugList()
				}
			},
			drugConfirm(value) {
				console.log(value)
				this.currentDrug = value
				this.setCurrentFilterByType('drugKey', 'custom');
			},
			drugItemClick(item) {
				const {
					key
				} = item
				// this.currentDeptKey = key
				// this.$emit('setCurrentDeptKey', key)
				this.setCurrentFilterByType('drugKey', key);
			},
			drugCustomClick() {
				this.drugSelectShow = true
			},
			setCurrentFilterByType(type, key) {
				this.$emit('setCurrentFilterByType', type, key)
			}
		}
	}
</script>

<style lang="scss">
	.dashBoardFilter {
		.dashBoardFilter-container-icon {
			width: 100rpx;
			text-align: right;

			.container-icon {
				width: 50rpx;
				height: 50rpx;
			}
		}


		.dashBoardFilter-header {
			text-align: right;
		}

		.dashBoardFilter-menuList {
			height: 100vh;

			width: 100%;
			padding: 20rpx 20rpx 140rpx 20rpx;

			.menuList-header {
				padding: 8rpx 8rpx 0rpx 8rpx;
				width: 100%;
				text-align: right;

				.container-icon {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.menuList-filter {
				height: 100%;
				overflow-y: scroll;

				.filter-title {
					font-size: 32rpx;
				}

				.filter-time,
				.filter-dept,
				.filter-region,
				.filter-drugs {
					margin-bottom: 30rpx;
				}

			}

			.menuList-button {
				padding: 40rpx;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;

				.button-item {
					margin-right: 10rpx;
					width: 50%;
				}
			}


		}
	}
</style>
