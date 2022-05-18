// const personNum = {
// 	one: "1人",
// 	two: "2人",
// 	// mt2: "2人以上",
// 	mt3: "3人以上"
// }
const booleanSelect = {
	true: '是',
	false: '否'

}
const selectFieldMap = {
	cooperate: booleanSelect,
	buildRoom: {
		'0': '否',
		'1': '是'
	},
	gender: {
		'0': '女',
		'1': '男'
	},
	usedApp: {
		wx: '微信',
		dy: '抖音',
		ks: '快手',
		tb: '淘宝',
		pdd: '拼多多',
		ysb: '药师帮',
		jrtt: '今日头条',
		qtt: '趣头条',
	},

	busySeason: {
		jan: '1月',
		feb: '2月',
		mar: '3月',
		apr: '4月',
		may: '5月',
		jun: '6月',
		jul: '7月',
		aug: '8月',
		sep: '9月',
		oct: '10月',
		nov: '11月',
		dec: '12月',
	},

	certification: {
		mil: '医疗机构执业许可证',
		bl: '营业执照',
		dq: '医师资格证',
		dpl: '医师执业证',
	},

	paymentWay: {
		cg: '现款现货',
		cod: '货到付款',
		rprp: '实销实付',
		dp: '先压货,次月付款',
	},
	doctorNumber: {
		one: "1人",
		two: "2人",
		mt3: "3人以上"
	},
	assistantNumber: {
		zero: '0人',
		one: "1人",
		mt2: "2人以上"
	},
	phoneBrand: {
		huawei: "华为",
		apple: "苹果",
		xiaomi: "小米",
		oppo: "oppo",
		vivo: "vivo",
		oldphone: "老人机",
		other: '其他品牌'
	},
	relationship: {
		couple: "夫妻",
		kindred: "亲戚",
		mentorship: "师徒",
		staff: '员工'
	},
	runningTime: {
		lf: "5年以下",
		ft: "5-10年",
		tt: "10-20年",
		mtt: "20年以上"
	},
	unClinicType: {
		1: "单体药店",
		2: "连锁药店",
		3: "商业公司"
	}
}

function getMap() {
	return selectFieldMap;
}

function getSelectItem() {
	let newObj = {}
	Object.keys(selectFieldMap).forEach((key, index) => {
		newObj[key] = translateToArray(selectFieldMap[key])
	})
	return newObj
}

function translateToArray(obj) {
	return Object.keys(obj).map(key => {
		let itemObj = {}
		return ({
			value: key,
			text: obj[key]
		})
	})
}
export default {
	getMap,
	getSelectItem
}
