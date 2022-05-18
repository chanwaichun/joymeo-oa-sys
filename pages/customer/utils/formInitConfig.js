const normal= {
	// 诊所基本信息
	clinicName: '',
	clinicDistrict: '',
	address: '',
	lat: '',
	lng: '',
	doctorNumber: '',
	assistantNumber: '',
	relationship: '',
	// 医生基本信息
	majorDoctor: '',
	gender: '2',
	age: '',
	operationYears: '',
	telPhone: '',
	phoneBrand: '',
	usedApp: '',
	// 诊所核心信息
	buildRoom: '2',
	clinicArea: '',
	rent: '',
	annualIncome: '',
	runningTime: '',
	inboundChannel: '',
	supervisionDepartment: '',
	certification: '',
	busySeason: '',
	paymentWay: '',
	cooperate: ''
}
const other = {
	unClinicName: '', //非诊所客户名称
	address: '', //地址
	regionName: '', //区域中文(xx省xx市xx县xx镇)
	telPhone: '', //联系方式
	unClinicType: 0, //客户类型(单体药店,连锁药店,商业公司)
	salesmanId: '', //所属销售id
	salesmanName: '', //销售姓名
	lat: '',
	lng: ''
}
const formInitConfig = {
	normal,
	other
}
export default formInitConfig;
