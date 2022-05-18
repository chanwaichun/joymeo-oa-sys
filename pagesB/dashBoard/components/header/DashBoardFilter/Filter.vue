<template>

	<view class="filter" :class='[type]'>
		<template v-if="type==='time'">
			<view class="filter-item" :class="[item.key==='custom'?'filter-item-custom':'']"
				v-for="(item,index) in filterSelectList" @click="itemClick(item)" :key="index">
				<view class="item-container" :class="[item.key===currentKey?'current':'']">{{
					setButtonName(item)
				}}</view>
			</view>
		</template>
		<template v-if="type==='dept'">
			<view class="filter-item" v-for="(item,index) in filterSelectList"
				:class="[item.key==='custom'?'filter-item-custom':'']" @click="itemClick(item)" :key="index">
				<view class="item-container" :class="[item.key===currentKey?'current':'']">{{setButtonName(item)}}
				</view>
			</view>
		</template>
		<template v-if="type==='region'">
			<view class="filter-item" v-for="(item,index) in filterSelectList"
				:class="[item.key==='custom'?'filter-item-custom region':'']" @click="itemClick(item)" :key="index">
				<view class="item-container" :class="[item.key===currentKey?'current':'']">{{setButtonName(item)}}
				</view>
			</view>
		</template>
		<template v-if="type==='classify'">
			<view class="filter-item" v-for="(item,index) in filterSelectList"
				:class="[item.key==='custom'?'filter-item-custom classify':'']" @click="itemClick(item)" :key="index">
				<view class="item-container" :class="[item.key===currentKey?'current':'']">{{setButtonName(item)}}
				</view>
			</view>
		</template>
		<template v-if="type==='drug'">
			<view class="filter-item" v-for="(item,index) in filterSelectList"
				:class="[item.key==='custom'?'filter-item-custom drug':'']" @click="itemClick(item)" :key="index">
				<view class="item-container" :class="[item.key===currentKey?'current':'']">{{setButtonName(item)}}
				</view>
			</view>
		</template>
	</view>



</template>

<script>
	export default {
		props: {
			selectList: {
				type: Array,
				default () {
					return []
				},
			},
			currentTime: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'time'
			},
			currentPage: {
				type: Object,
				default: () => {}
			},
			currentDrug: {
				type: Array,
				default: () => []
			},
			currentKey: {
				type: String,
				default: ''
			},
			currentDept: {
				type: Array,
				default: () => []
			},
			currentRegion: {
				type: Array,
				default: () => []
			},
			currentClassify: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			filterSelectList() {
				if (this.type === 'time' && this.currentPage.type !== 'OTC') {
					return this.selectList.filter(item => {
						return item.key !== 'yesterday'
					})
				}
				return this.selectList
			}
		},
		methods: {
			setButtonName(item) {
				if (this.type === 'time' && item.key === 'custom') {
					return this.currentTime ? this.currentTime : item.name
				}
				if (this.type === 'dept' && item.key === 'custom') {
					return this.currentDept.length > 0 ? this.currentDept.map(item => {
						return item.text
					}).join('-') : item.name
				}
				if (this.type === 'region' && item.key === 'custom') {
					return this.currentRegion.length > 0 ? this.currentRegion.map(item => {
						return item.text
					}).join('-') : item.name
				}
				if (this.type === 'classify' && item.key === 'custom') {
					return this.currentClassify.length > 0 ? this.currentClassify.map(item => {
						return item.text
					}).join('-') : item.name
				}
				if (this.type === 'drug' && item.key === 'custom') {
					return this.currentDrug.length > 0 ? Array.from(this.currentDrug)[0].label : item.name
				}
				return item.name

			},
			itemClick(item) {
				if (item.key !== 'custom') {
					this.$emit('itemClick', item)
				} else {
					this.$emit('customClick')
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/common.scss';

	.filter {
		display: flex;
		flex-wrap: wrap;


		.filter-container {

			position: absolute;
			width: 100%;
			height: 100;
			top: 0;
			left: 0;

		}

		.filter-item {
			width: 25%;
			padding: 10rpx;

			&.filter-item-custom {
				width: 50%;

				&.region {
					width: 75%;
				}

				&.drug {
					width: 75%;
				}

				&.classify {
					width: 75%;
				}
			}

			.item-container {
				height: 75rpx;
				border-radius: $common-border-radius;
				padding: 10rpx;
				color: $common-color-3;
				border: 1px solid $common-border-color;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;

				&.current {
					color: #FFFFFF;
					background-color: $common-blue-2;
				}
			}
		}
	}
</style>
