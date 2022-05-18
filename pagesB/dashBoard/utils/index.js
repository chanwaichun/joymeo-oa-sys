import moment from 'miment'

// 根据公共的filter值转化时间显示
function setFilterTime(filter) {
	const {
		dateType
	} = filter;
	if (dateType) {
		const currentMonthFirstDay = moment().firstDay().format('YYYY-MM-DD')
		const prevMonthLastDay = moment().sub(1, 'MM').lastDay().format('YYYY-MM-DD')
		const prevMonthFirstDay = moment().sub(1, 'MM').firstDay().format('YYYY-MM-DD')
		const filterType = {
			yesterday: {
				currentRange: `${moment().sub(1,'DD').format('YYYY-MM-DD')}`,
				currentKey: '昨天'
			},
			today: {
				currentRange: `${moment().format('YYYY-MM-DD')}`,
				currentKey: '今天'
			},
			n7days: {
				currentRange: `${moment().sub(7,'DD').format('YYYY-MM-DD')}~${moment().sub(1,'DD').format('YYYY-MM-DD')}`,
				currentKey: '近7天'

			},
			n30days: {
				currentRange: `${moment().sub(30,'DD').format('YYYY-MM-DD')}~${moment().sub(1,'DD').format('YYYY-MM-DD')}`,
				currentKey: '近30天'
			},
			tmonth: {
				currentRange: `${currentMonthFirstDay}~${moment().format('YYYY-MM-DD')}`,
				currentKey: '本月'
			},
			lmonth: {
				currentRange: `${prevMonthFirstDay}~${prevMonthLastDay}`,
				currentKey: '上月'
			},
			// n3month: {
			// 	currentRange: `${moment().sub(3,'MM').format('YYYY-MM-DD')}~${moment().format('YYYY-MM-DD')}`,
			// 	currentKey: '3月'
			// }
		}

		return filterType[dateType]
	} else {
		const {
			startDate,
			endDate
		} = filter;
		return {
			currentRange: `${startDate}~${endDate}`,
			currentKey: '自定义时间'
		}
	}

}

export default {
	setFilterTime,
}
