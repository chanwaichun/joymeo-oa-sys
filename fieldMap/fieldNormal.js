// type類型：mount數量，money數額，rate数率
// mount数量
// money数额
//客户模块
const customer = {
	clinicName: {
		name: '门诊名称'
	},
	clinicDistrict: {
		name: '诊所区域'
	},
	address: {
		name: '客户地址'
	},
	lng: {
		name: '经度'
	},
	lat: {
		name: '维度'
	},
	doctorNumber: {
		name: '诊所医生人数'
	},
	assistantNumber: {
		name: '诊所辅助人员人数'
	},
	majorDoctor: {
		name: '医生姓名'
	},
	gender: {
		name: '医生性别'
	},
	age: {
		name: '医生年龄'
	},
	operationYears: {
		name: '行医年龄'
	},
	telPhone: {
		name: '联系方式'
	},
	phoneBrand: {
		name: '使用手机品牌'
	},
	usedApp: {
		name: '手机常用app'
	},
	buildRoom: {
		name: '是否自建房'
	},
	rent: {
		name: '诊所租金',
		unitCN: '元'
	},
	clinicArea: {
		name: '诊所面积',
		unitCN: 'm²'
	},
	annualIncome: {
		name: '诊所年均收入',
		unitCN: '万元'
	},
	runningTime: {
		name: '诊所开办年限'
	},
	inboundChannel: {
		name: '进货渠道'
	},
	supervisionDepartment: {
		name: '诊所上级监管部门'
	},
	certification: {
		name: '诊所资质'
	},
	busySeason: {
		name: '诊所旺季'
	},
	paymentWay: {
		name: '诊所经常使用结款方式'
	},
	cooperate: {
		name: '诊所是否有意愿和卓悦签约合作'
	},
	relationship: {
		name: '诊所人员关系'
	},
}
// 任务考勤模块
const attence = {
	RADIO: {
		name: '单选'
	},
	MULTIPLE: {
		name: '多选'
	},
	TEXT: {
		name: '文本'
	},
	PICTURE: {
		name: '图片上传'
	},
	DATE: {
		name: '日期'
	},
	LOCATION: {
		name: '地理位置'
	}
}
// 非诊所客户模块
const unclinic = {
	unClinicName: {
		name: '客户名称'
	}, //非诊所客户名称
	unClinicType: {
		name: '客户类型'
	}, //客户类型(单体药店,连锁药店,商业公司)
}
// 考核模块
const access = {
	addMemberNum: {
		name: '录入客户',
		unitCN: '个'
	},
	nowSalesMoney: {
		name: '当前销售额',
		unitCN: '元'
	},
	doneTask: {
		name: '完成任务',
		unitCN: '个'
	},
	doneKpi: {
		type: 'mount'
	},
	visitCustomers: {
		name: '打卡次数',
		unitCN: '个'
	},
	signInDays: {
		name: '打卡天数',
		unitCN: '次'
	},
	MEMBER_NUM: {
		name: '签约客户量',
		type: 'mount',
		unitCN: '个'
	},
	SALES_NUM: {
		name: '销售量',
		type: 'mount',
		unit: ''
	},
	SALES_MONEY: {
		name: '销售额',
		type: 'money',
		unit: '￥',
		unitCN: '元'
	},
	YEAR: {
		name: '本年'
	},
	MONTH: {
		name: '本月'
	},
	WEEK: {
		name: '本周'
	}

}
const fieldMap = {
	...customer,
	...attence,
	...unclinic,
	...access
}

function setEmptyValue(isNull) {
	return isNull ? '' : '-'
}
//isNull为字段是否为空字符
function getFieldAttribute(key, attribute, isNull) {
	if (!key) {
		return setEmptyValue(isNull)
	}
	if (fieldMap.hasOwnProperty(key)) {
		return fieldMap[key][attribute] ? fieldMap[key][attribute] : setEmptyValue(isNull)
	} else {
		return setEmptyValue(isNull)
	}

}
export default {
	getFieldAttribute
}
