<template>
	<view class="rank" v-if="rankList.length">
		<view class="rank-item" v-for="(item,index) in rankList" :key="index">
			<view class="item-describe">
				<view class="item-describe-name u-flex u-col-center">
					<image class="name-rankTop" :src="setSrcByIndex(index)" v-if="index + 1 > 0 && index + 1 < 4">
					</image>
					<view class="name-rank" v-if="index + 1 > 3 && activeSelect==='MEMBER_NUM'">
						{{item.expClinicNumRank}}</view>
					<view class="name-rank" v-else-if="index + 1 > 3">{{item.salesAmountrank}}</view>
					{{item.userName}}
				</view>
				<view v-if="activeSelect==='MEMBER_NUM'" class="item-describe-money">
					{{item.expClinicNum}}
				</view>
				<view v-else class="item-describe-money u-flex u-col-center">
					￥{{item.salesAmount}}
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			activeSelect: {
				type: String
			},
			rankList: {
				type: Array,
				default: []
			}
		},
		computed: {

		},
		methods: {
			setSrcByIndex(index) {
				return `https://static.joymeohis.com/wx/gongzonghao/image/rank_${index+1}.png`
			},
			max(activeSelect) {
				if (activeSelect === 'MEMBER_NUM') {
					return this.rankList[0].customerNum
				} else {
					return this.rankList[0].totalPrice
				}

			},
			getPercent(activeSelect, item) {
				if (activeSelect === 'MEMBER_NUM') {
					return (item.customerNum / this.max(activeSelect)) * 100
				} else {
					return (item.totalPrice / this.max(activeSelect)) * 100
				}
			},
			setColor(index) {
				if (index === 0) {
					return '#F58206'
				} else if (index === 1) {
					return '#0090CC'
				} else if (index === 2) {
					return '#CCAD00'
				} else {
					return '#303133'
				}
			}
		}
	}
</script>

<style lang="scss">
	.rank {
		display: flex;
		flex-direction: column;
		padding: 36rpx 24rpx;
	}

	.item-describe {
		font-size: 28rpx;
		display: flex;
		justify-content: space-between;
		padding: 36rpx 0rpx;
		border-bottom: 1px solid #F0F0F0;
		color: #1A1A1A;

		.item-describe-name {

			font-size: 32rpx;

			.name-rankTop,
			.name-rank {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;

			}

			.name-rank {
				border-radius: 50%;
				background-color: #E6E6E6;
				line-height: 40rpx;
				text-align: center;
				font-size: 24rpx;
			}
		}

		.item-describe-money {
			font-size: 24rpx;
			font-weight: bold;
		}
	}
</style>
