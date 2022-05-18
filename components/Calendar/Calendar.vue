<template>
	<!--components/calendar/calendar.wxml-->
	<view class="calendar">
		<view class="calendar-title u-flex u-row-between u-col-center">
			<view class="title-date u-flex">
				<u-icon name="arrow-left" size="30" @click="lastMonth"></u-icon>
				<view class="date-value" v-if="selectDay.year">{{ selectDay.year }}-{{
            selectDay.month > 9 ? selectDay.month : "0" + selectDay.month
          }}-{{ selectDay.day > 9 ? selectDay.day : "0" + selectDay.day }}</view>
				<u-icon name="arrow-right" size="30" @click="nextMonth"></u-icon>
			</view>
			<view class="title-button u-flex" @click="backToToday">
				<image :lazy-load="true" class="calendar-icon common-icon-size"
					src="https://static.joymeohis.com/wx/gongzonghao/image/calendar_task.png">
				</image>
				回到今天
			</view>
		</view>

		<!-- 日历头部 -->
		<view class="u-flex u-row-around calendar-week">
			<view class="view">日</view>
			<view class="view">一</view>
			<view class="view">二</view>
			<view class="view">三</view>
			<view class="view">四</view>
			<view class="view">五</view>
			<view class="view">六</view>
		</view>

		<!-- 日历主体 -->
		<view class="u-flex flex-wrap calendar-main">
			<view v-for="(item, index) in dateList" :key="index" class="day">
				<view class="bg" :class="[
            item.year === selectDay.year && item.month === selectDay.month
              ? item.day === selectDay.day
                ? 'select'
                : ''
              : 'other-month',
          ]" @click="
            selectChange(item.day, item.month, item.year, item.dateString)
          ">
					{{ item.day }}
				</view>
				<view class="spot" v-if="item.spot && isShowSpot"></view>
			</view>
		</view>
		<view class="calendar-button" @click="openChange">
			<u-icon size="30" :name="!open ? 'arrow-down':'arrow-up'" color="#4975C0"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			spot: {
				type: Array,
				value: [],
			},
			defaultTime: {
				type: String,
				value: "",
			},
			isShowSpot: {
				type: Boolean,
				value: true,
			}
		},
		watch: {
			spot() {

				this.setSpot();
			},
		},
		data() {
			return {
				dateList: [], //日历主体渲染数组
				selectDay: {}, //选中时间
				open: false,
			};
		},
		mounted() {
			let now = this.defaultTime ? new Date(this.defaultTime) : new Date();
			let selectDay = {
				year: now.getFullYear(),
				month: now.getMonth() + 1,
				day: now.getDate(),
				dateString: this.formatTime(now, "Y-M-D"),
			};
			this.setMonth(selectDay.year, selectDay.month, selectDay.day);
		},
		methods: {
			/**
			 * 时间戳转化为年 月 日 时 分 秒
			 * time: 需要被格式化的时间，可以被new Date()解析即可
			 * format：格式化之后返回的格式，年月日时分秒分别为Y, M, D, h, m, s，这个参数不填的话则显示多久前
			 */
			formatTime(time, format) {
				function formatNumber(n) {
					n = n.toString();
					return n[1] ? n : "0" + n;
				}

				function getDate(time, format) {
					const formateArr = ["Y", "M", "D", "h", "m", "s"];
					const returnArr = [];
					const date = new Date(time);
					returnArr.push(date.getFullYear());
					returnArr.push(formatNumber(date.getMonth() + 1));
					returnArr.push(formatNumber(date.getDate()));
					returnArr.push(formatNumber(date.getHours()));
					returnArr.push(formatNumber(date.getMinutes()));
					returnArr.push(formatNumber(date.getSeconds()));
					for (const i in returnArr) {
						format = format.replace(formateArr[i], returnArr[i]);
					}
					return format;
				}

				function getDateDiff(time) {
					let r = "";
					const ft = new Date(time);
					const nt = new Date();
					const nd = new Date(nt);
					nd.setHours(23);
					nd.setMinutes(59);
					nd.setSeconds(59);
					nd.setMilliseconds(999);
					const d = parseInt((nd - ft) / 86400000);
					switch (true) {
						case d === 0:
							const t = parseInt(nt / 1000) - parseInt(ft / 1000);
							switch (true) {
								case t < 60:
									r = "刚刚";
									break;
								case t < 3600:
									r = parseInt(t / 60) + "分钟前";
									break;
								default:
									r = parseInt(t / 3600) + "小时前";
							}
							break;
						case d === 1:
							r = "昨天";
							break;
						case d === 2:
							r = "前天";
							break;
						case d > 2 && d < 30:
							r = d + "天前";
							break;
						default:
							r = getDate(time, "Y-M-D");
					}
					return r;
				}
				if (!format) {
					return getDateDiff(time);
				} else {
					return getDate(time, format);
				}
			},
			//picker设置月份
			editMonth(e) {
				const arr = e.detail.value.split("-");
				const year = parseInt(arr[0]);
				const month = parseInt(arr[1]);
				this.setMonth(year, month);
			},
			//上月切换按钮点击
			lastMonth() {
				// if (this.open) {
				const lastMonth = new Date(
					this.selectDay.year,
					this.selectDay.month - 2
				);
				const year = lastMonth.getFullYear();
				const month = lastMonth.getMonth() + 1;
				this.setMonth(year, month);
				// } else {
				// 	const year = lastMonth.getFullYear();
				// 	const month = lastMonth.getMonth() + 1;
				// 	this.selectChange();

				// }
				this.$emit("onChange", this.selectDay);
			},
			//下月切换按钮点击
			nextMonth() {
				const nextMonth = new Date(this.selectDay.year, this.selectDay.month);
				const year = nextMonth.getFullYear();
				const month = nextMonth.getMonth() + 1;
				this.setMonth(year, month);
				this.$emit("onChange", this.selectDay);
			},
			//设置月份
			setMonth(setYear, setMonth, setDay) {
				if (
					this.selectDay.year !== setYear ||
					this.selectDay.month !== setMonth
				) {
					const day = Math.min(
						new Date(setYear, setMonth, 0).getDate(),
						this.selectDay.day
					);
					const time = new Date(setYear, setMonth - 1, setDay ? setDay : day);
					const data = {
						selectDay: {
							year: setYear,
							month: setMonth,
							day: setDay ? setDay : day,
							dateString: this.formatTime(time, "Y-M-D"),
						},
					};
					// if (!setDay) {
					// 	this.open = true;
					// }
					this.selectDay = data.selectDay;
					this.dateInit(setYear, setMonth);
					this.setSpot();

				}
			},
			//展开收起
			openChange() {
				this.open = !this.open;
				this.dateInit();
				this.setSpot();
			},
			backToToday() {
				let day = Number(this.$moment().get('DD'));
				let month = Number(this.$moment().get('MM'));
				let year = Number(this.$moment().get('YYYY'));
				let dateString = this.$moment().format('YYYY-MM-DD')
				this.selectChange(day, month, year, dateString)
			},
			//设置日历底下是否展示小圆点
			setSpot() {
				const timeArr = this.spot.map((item) => {
					return this.formatTime(item, "Y-M-D");
				});
				let dateList = this.dateList;
				dateList.forEach((item) => {
					if (timeArr.indexOf(item.dateString) !== -1) {
						item.spot = true;
					} else {
						item.spot = false;
					}
				});
				this.dateList = dateList;
			},
			//日历主体的渲染方法
			dateInit(setYear = this.selectDay.year, setMonth = this.selectDay.month) {
				let dateList = []; //需要遍历的日历数组数据
				let now = new Date(setYear, setMonth - 1); //当前月份的1号
				let startWeek = now.getDay(); //目标月1号对应的星期
				let dayNum = new Date(setYear, setMonth, 0).getDate(); //当前月有多少天
				let forNum = Math.ceil((startWeek + dayNum) / 7) * 7; //当前月跨越的周数
				if (this.open) {
					//展开状态，需要渲染完整的月份
					for (let i = 0; i < forNum; i++) {
						const now2 = new Date(now);
						now2.setDate(i - startWeek + 1);
						let obj = {};
						obj = {
							day: now2.getDate(),
							month: now2.getMonth() + 1,
							year: now2.getFullYear(),
							dateString: this.formatTime(now2, "Y-M-D"),
						};
						dateList[i] = obj;
					}
				} else {
					//非展开状态，只需要渲染当前周
					for (let i = 0; i < 7; i++) {
						const now2 = new Date(now);
						//当前周的7天
						now2.setDate(
							Math.ceil((this.selectDay.day + startWeek) / 7) * 7 -
							6 -
							startWeek +
							i
						);
						let obj = {};
						obj = {
							day: now2.getDate(),
							month: now2.getMonth() + 1,
							year: now2.getFullYear(),
							dateString: this.formatTime(now2, "Y-M-D"),
						};
						dateList[i] = obj;
					}
				}

				this.dateList = dateList;
			},
			//一天被点击时
			selectChange(day, month, year, dateString) {
				const selectDay = {
					year: year,
					month: month,
					day: day,
					dateString: dateString,
				};
				if (this.selectDay.year !== year || this.selectDay.month !== month) {
					this.setMonth(year, month, day);
					this.$emit("onChange", this.selectDay);
				} else if (this.selectDay.day !== day) {
					this.selectDay = selectDay;
					this.$emit("onChange", this.selectDay);
				}
			},
		},
	};
</script>

<style lang="scss">
	@import '@/common/common.scss';

	.calendar-icon {
		margin-top: 12rpx;
	}


	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.direction-column {
		flex-direction: column;
	}

	.flex1 {
		flex: 1;
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flex-start {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.flex-around {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.align-start {
		align-items: flex-start;
	}

	.align-end {
		align-items: flex-end;
	}

	.align-stretch {
		align-items: stretch;
	}

	.calendar {
		--itemwidth: 14.2%;
		background-color: #FFFFFF;
		padding-bottom: 24rpx;

		.calendar-title {
			font-size: 40rpx;
			color: #333;
			padding: 0 30rpx;
			line-height: 60rpx;

			.title-date {
				.date-value {
					font-size: 32rpx;
					padding: 12rpx;
				}
			}

			.title-button {
				font-size: 36rpx;
			}

			.year-month {
				margin-right: 20rpx;
			}

			.icon {
				padding: 0 16rpx;
				font-size: 32rpx;
				color: #999;
			}

			.open {
				background-color: #f6f6f6;
				color: #999;
				font-size: 22rpx;
				line-height: 36rpx;
				border-radius: 18rpx;
				padding: 0 14rpx;
			}
		}

		.calendar-week {
			padding-bottom: 20rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			color: $common-grey-1;

			.view {
				width: var(--itemwidth);
				text-align: center;
			}
		}

		.calendar-main {
			transition: height 0.3s;
			overflow: hidden;

			.day {
				position: relative;
				width: var(--itemwidth);
				color: #666;
				text-align: center;
				padding: 12rpx 0rpx;

				.bg {
					height: 56rpx;
					line-height: 56rpx;
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
				}

				.select {
					width: 56rpx;
					border-radius: 50%;
					text-align: center;
					color: #fff;
					background-color: #4975C0;
					margin: 0 auto;
				}

				.other-month {
					color: #ccc;
				}

				.spot {
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					width: 8rpx;
					height: 8rpx;
					background-color: #4975C0;
					border-radius: 50%;
					margin: 6rpx auto 0;
				}
			}
		}

		.calendar-button {
			text-align: center;
		}
	}
</style>
