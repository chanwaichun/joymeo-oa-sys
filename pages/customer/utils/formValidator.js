// 表单验证
import util from '@/utils/util.js'
const normal = {
	clinicName: [{
		required: true,
		message: '请输入诊所名称',
		trigger: ['blur', 'change']
	}],
	address: [{
		required: true,
		message: '请选择诊所地址',
		trigger: ['blur', 'change']
	}],
	age: [{
		validator: (rule, value, callback) => {
			if (String(value).length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return Number(value) <= 120 && Number(value) >= 0
			} else {
				return true
			}
		},
		message: '请输入0到120以内的数字',
		trigger: ['blur', 'change'],
	}],
	operationYears: [{
		validator: (rule, value, callback) => {
			if (String(value).length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return Number(value) <= 120 && Number(value) >= 0
			} else {
				return true
			}

		},
		message: '请输入0到120以内的数字',
		trigger: ['blur', 'change'],
	}],
	telPhone: [{
		validator: (rule, value, callback) => {
			if (value.length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return util.checkMobile(value)
			} else {
				return true
			}

		},
		message: '请输入正确的手机号码',
		trigger: ['blur', 'change'],
	}],
	clinicArea: [{
		validator: (rule, value, callback) => {
			if (value.length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return Number(value) <= 999999 && Number(value) >= 0
			} else {
				return true
			}

		},
		message: '请输入0到999999以内的数字',
		trigger: ['blur', 'change'],
	}],
	rent: [{
		validator: (rule, value, callback) => {
			if (String(value).length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return Number(value) <= 999999 && Number(value) >= 0
			} else {
				return true
			}

		},
		message: '请输入0到999999以内的数字',
		trigger: ['blur', 'change'],
	}],
	annualIncome: [{
		validator: (rule, value, callback) => {
			if (String(value).length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return Number(value) <= 999999999 && Number(value) >= 0

			} else {
				return true
			}


		},
		message: '请输入0到999999999以内的数字',
		trigger: ['blur', 'change'],
	}],

}

const other = {
	unClinicName: [{
		required: true,
		message: '请输入诊所名称',
		trigger: ['blur', 'change']
	}],
	address: [{
		required: true,
		message: '请选择诊所地址',
		trigger: ['blur', 'change']
	}],
	unClinicType: [{
		required: true,
		message: '请选择客户类型',
		trigger: ['blur', 'change']
	}],
	telPhone: [{
		validator: (rule, value, callback) => {
			if (value.length > 0) {
				if (isNaN(Number(value))) {
					return false
				}
				return util.checkMobile(value);
			} else {
				return true
			}

		},
		required: true,
		message: '请输入正确的手机号码',
		trigger: ['blur', 'change'],
	}],

}
const formValiDator = {
	normal,
	other
}
export default formValiDator
