// 销售分析字段
const saleAnalyse = {
	purchaseProductAmount: {
		name: '商品应收金额',
		unitCN: '元'
	},
	totalClinicNum:{
		name: '诊所数',
		unitCN: '个'
	},
	lastOrderDays: {
		name: '连续无业绩天数',
		unitCN: '天'
	},
	grossMerchandiseVolume: {
		name: '应收金额',
		unitCN: '元'
	},
	purchaseAmount: {
		name: '实收金额',
		unitCN: '元'
	},
	purchaseOrderNum: {
		name: '订单数',
		unitCN: '单'
	},
	purchaseClinicNum: {
		name: '下单诊所',
		unitCN: '家'
	},
	purchaseProductNum: {
		name: '商品数',
		unitCN: '个'
	},
	purchaseAmountPerClinic: {
		name: '客单价',
		unitCN: '元'
	},
	purchaseRate: {
		name: '下单转化率',
		type: 'rate',
		unitCN: '%'
	},
	salesmanName: {
		name: '城市经理'
	},
	saleName:{
		name: '城市经理'
	}
}
const income = {

	productNumOrderNumRate: {
		name: '件单比',
		unitCN: '%',
		type: 'rate'
	},
	grossMerchandiseVolumeGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //应收金额 环比
	purchaseAmountGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //实收金额 环比
	purchaseOrderNumGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //订单数 环比
	purchaseAmountPerClinicGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //客单价 环比
	purchaseClinicNumGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //下单诊所 环比
	purchaseRateGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //下单转化率 环比
	purchaseProductNumGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //商品销售量 环比
	productNumOrderNumRateGrowth: {
		unitCN: '%',
		type: 'rate'
	}, //件单比 环比
	accLogClinicNumGrowthSpeed: {
		unitCN: '%',
		type: 'rate'
	},
	accCooperateClinicGrowthSpeed: {
		unitCN: '%',
		type: 'rate'
	},
	accRecipeNumGrowthSpeed: {
		unitCN: '%',
		type: 'rate'
	},
	drugsTotalSum:{
		unitCN: '个',
	},
	joymeoDrugSum:{
		unitCN: '个',
	}
}

const fieldBigData = {
	...saleAnalyse,
	...income,
	userName: {
		name: '姓名'
	},
	deptName: {
		name: '部门'
	},
	logUserNum: {
		name: '登录人数',
		unitCN: '人'
	},
	punchClockNum: {
		name: '打卡次数',
		unitCN: '次'
	},
	salesAmount: {
		name: '销售额',
		unitCN: '元',
		description: '完成值=销售商品数 X 终端进货价'
	},
	salesAmountGrowth: {
		name: '销售额增长',
		unitCN: '%',
		description: '',
		type: 'rate'
	},
	customerNumGrowth: {
		name: '销售门店增长',
		unitCN: '%',
		description: '',
		type: 'rate'
	},
	salesNumGrowth: {
		name: '销售门店增长',
		unitCN: '%',
		description: '',
		type: 'rate'
	},
	sumSalesAmount: {
		name: '实际销售额',
		unitCN: '元'
	},
	kpiValue: {
		name: '目标销售额',
		unitCN: '元'
	},
	sumKpiValue: {
		name: '目标销售额',
		unitCN: '元'
	},
	doneRatio: {
		name: '完成率',
		unitCN: '%',
		type: 'rate'
	},

	salesAmountrank: {
		name: '销售额排名'
	},
	logUserGrowthByDay: {
		type: 'rate'
	},
	logUserGrowthByWeek: {
		type: 'rate'
	},
	expClinicNumSum: {
		name: '新增诊所数',
		unitCN: '家'
	},
	expClinicGrowthByDay: {
		type: 'rate'
	},
	expClinicGrowthByWeek: {
		type: 'rate'
	},
	clockUserGrowthByWeek: {
		type: 'rate'
	},
	clockUserNum: {
		name: '打卡人数',
		unitCN: '人'
	},
	clockUserGrowthByDay: {
		type: 'rate'
	},
	clockUserGrowthByWeek: {
		type: 'rate'
	},
	clockRate: {
		name: '打卡率',
		type: 'rate'
	},
	clockRateGrowthByDay: {
		type: 'rate'
	},
	clockRateGrowthByWeek: {
		type: 'rate'
	},
	salesAmountSum: {
		name: '货款报备金额',
		unitCN: '元'
	},
	salesAmountGrowthByDay: {
		type: 'rate'
	},
	salesAmountGrowthByWeek: {
		type: 'rate'
	},
	logClinicNum: {
		name: 'HIS注册数',
		unitCN: '家'
	},
	patientNum: {
		name: '接诊人数',
		unitCN: '人'
	},
	visitVum: {
		name: '接诊单数',
		unitCN: '单'
	},
	averageRecipeNum: {
		name: '平均处方单',
		unitCN: '单'
	},
	warehouseSkuNum: {
		name: '诊所商品数',
		unitCN: '个'
	},
	warehouseSkuNum: {
		name: '诊所商品数',
		unitCN: '个'
	},
	patientNumGrowthByDay: {
		type: 'rate',
	},
	visitNumGrowthByDay: {
		type: 'rate',
	},
	clinicNumGrowthByDay: {
		type: 'rate',
	},
	cooperateClinicNumGrowthByDay: {
		type: 'rate',
	},
	recipeNumGrowthByDay: {
		type: 'rate',
	},
	activeClinicNumGrowthByDay: {
		type: 'rate',
	},
	averageRecipeNumGrowthByDay: {
		type: 'rate',
	},
	warehouseSkuNumGrowthByDay: {
		type: 'rate',
	},
	accLogClinicNum: {
		name: '累计诊所数',
		unitCN: '家'
	},
	cooperateClinicNum: {
		name: 'HIS签约数',
		unitCN: '家'
	},
	accCooperateClinicNum: {
		name: '累计签约数',
		unitCN: '家'
	},
	cooperateClinicNum: {
		name: 'HIS签约数',
		unitCN: '家'
	},
	cooperateRate: {
		name: '完成率',
		type: 'rate'
	},
	activeRate: {
		name: '完成率',
		type: 'rate',
		unitCN: '%'
	},
	visitRate: {
		name: '完成率',
		type: 'rate',
		unitCN: '%'
	},
	recipeRate: {
		name: '完成率',
		type: 'rate'
	},
	recipeNum: {
		name: '处方单',
		unitCN: '单'
	},
	visitNum: {
		name: '接诊单',
		unitCN: '单'
	},
	activeClinicNum: {
		name: '活跃诊所',
		unitCN: '家'
	},
	clinicActiveRate: {
		name: '活跃率',
		type: 'rate',
		unitCN: '%'
	},
	averageVisitNum: {
		name: '平均接诊单',
		unitCN: '单'
	},
	accRecipeNum: {
		name: '累计处方单',
		unitCN: '单'
	},
	accVisitNum: {
		name: '累计接诊单',
		unitCN: '个'
	},
	accLogClinicNum: {
		name: '累计注册数',
		unitCN: '个'
	},
	accLogClinicNumRate: {
		name: '增速',
		unitCN: '%',
		type: 'rate',
	},
	accCooperateClinicNum: {
		name: '累计签约数',
		unitCN: '个'
	},
	accCooperateClinicNumRate: {
		name: '增速',
		unitCN: '%',
		type: 'rate',
	},
	accRecipeNum: {
		name: '累计处方单',
		unitCN: '个'
	},
	accRecipeNumRate: {
		name: '增速',
		unitCN: '%',
		type: 'rate',
	}
}

function setEmptyValue(isNull) {
	return isNull ? '' : '-'
}

function format(key, value, options = {
	isNeedUnit: false
}) {
	if (value === null) {
		return '--'
	}

	if (fieldBigData.hasOwnProperty(key)) {

		const type = fieldBigData[key]['type'];
		if (type === 'rate' && options.isNeedUnit) {
			return value ? `${(Number(value)*100).toFixed(2)}%` : `0%`
		} else if (type === 'rate') {
			if (isNaN(Number(value))) {
				return value
			}
			return value ? Number((value * 100).toFixed(2)) : 0
		}
		return typeof value === 'string' || isNaN(Number(value)) ? value || '--' : value ? Number(value.toFixed(2)) : 0
	}
	return value


}

function getFieldAttribute(key, attribute, isNull) {
	if (!key) {
		return setEmptyValue(isNull)
	}
	if (fieldBigData.hasOwnProperty(key)) {
		return fieldBigData[key][attribute] ? fieldBigData[key][attribute] : setEmptyValue(isNull)
	} else {
		return setEmptyValue(isNull)
	}

}
export default {
	getFieldAttribute,
	format
}
