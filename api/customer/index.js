import server from '../index.js'
// #客户管理模块
const customer = {
	setLeavePage: {
		url: '/user/leave/page',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',
	},
	// 临时接口
	setBrowsePage: {
		url: '/user/browse/page',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',
	},
	// 登录功能
	login: {
		url: '/user/login',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',
	},
	// 获取药品列表
	getDrugList: {
		url: '/bd-customer/paymentReporting/getDrugsListPageByKeyWord',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',
	},
	// 新增货款报备
	productInsert: {
		apiName: 'productInsert',
		url: '/bd-customer/paymentReporting/insertPaymentReporting',
		method: 'POST',
		server: server.qywx,
		origin: 'customer',
	},
	// 获取货款报备列表
	productGetList: {
		url: '/bd-customer/paymentReporting/getPaymentReportingGroupByStaffId',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',

	},
	productGetDetail: {
		url: '/bd-customer/paymentReporting/getPaymentReportingByStaffIdAndCustomer',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',
	},
	productGetCountDetail: {
		url: '/bd-customer/paymentReporting/getPaymentReportingCountByStaffIdAndCustomerId',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',
	},
	getPaymentReportingRank: {
		url: '/bd-customer/paymentReporting/getPaymentReportingOrderBy',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	// 获取发货计划的商品数目
	getPlanListItem: {
		url: '/bd-customer/deliverPlan/getDeliverPlanByDeptId',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	// 提交发货计划
	submitPlanListItem: {
		url: '/bd-customer/deliverPlan/submitDeliverPlanByPlantId',
		method: 'POST',
		server: server.qywx,
		origin: 'customer'
	},
	getPlanHistory: {
		url: '/bd-customer/deliverPlan/getDeliverPlanSubmitHistoryByPlanId',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	getPlanHistoryDetail: {
		url: '/bd-customer/deliverPlan/getDeliverPlanSubmitHistoryProductByPlanId',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	checkPlanIsSubmit: {
		url: '/bd-customer/deliverPlan/getDeliverPlanSubmitByPlanIdAndStaffId',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	// 获取附近的诊所
	clinicGetList: {
		url: '/punchClock/queryCliInfoWithLng',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',

	},
	// 打卡
	punchClockInsert: {
		url: '/punchClock/insert',
		method: 'POST',
		server: server.qywx,
		origin: 'customer',

	},
	// 退卡
	punchClockOff: {
		url: '/punchClock/off',
		method: 'GET',
		server: server.qywx,
		origin: 'customer',

	},
	getSalesTaskList: {
		url: '/execuRecord/getSalesTaskList',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	getTaskBoardCurrent: {
		url: '/execuRecord/getCurrentTaskPageList',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	getTaskBoardFinished: {
		url: '/execuRecord/getFinishExecutionRecord',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	getExecuTaskDetail: {
		url: '/execuRecord/getTaskExecutionDetailList',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	commitExecuRecord: {
		url: '/execuRecord/commitExecuRecord',
		method: 'POST',
		server: server.qywx,
		origin: 'customer'
	},
	submitExecuRecord: {
		url: '/execuRecord/submitExecuRecord',
		method: 'POST',
		server: server.qywx,
		origin: 'customer'
	},
	getSalesTaskDetail: {
		url: '/elements/listElements',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	},
	//问题反馈
	submitFeedback: {
		url: '/bd-customer/problemFeedback/insertProblemFeedback',
		method: 'POST',
		server: server.qywx,
		origin: 'customer'
	},
	getFeedbackLabel: {
		url: '/bd-customer/problemFeedback/getFeedbackLabelList',
		method: 'GET',
		server: server.qywx,
		origin: 'customer'
	}



}
export default customer;