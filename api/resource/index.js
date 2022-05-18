import server from '../index.js'
// #资源模块
const resource = {
	getJoymeoDrugList: {
		url: '/resource/product/joymeo/list',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},
	//查询客户
	customerGetList: {
		url: '/clinicCustomer/queryMyCusCliList',
		method: 'GET',
		server: server.qywx,
		origin: 'resource',
	},
	// 获取客户详情
	customerGetDetail: {
		url: '/clinicCustomer/queryCusCli',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},

	//新增客户 
	customerInsert: {
		apiName: 'customerInsert',
		url: '/clinicCustomer/insert',
		method: 'POST',
		server: server.qywx,
		origin: 'resource'
	},
	// 编辑客户信息
	customerUpdate: {
		apiName: 'customerUpdate',
		url: '/clinicCustomer/updateCusCli',
		method: 'POST',
		server: server.qywx,
		origin: 'resource'

	},
	//非客户列表获取
	getUnclinicList: {
		url: '/unclinic/listPageUnClinicBySalesmanId',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},
	getUnclinicDetail: {
		url: '/unclinic/getUnClinicDetail',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},
	unclinicUpdate: {
		apiName: 'unclinicUpdate',
		url: '/unclinic/updateUnClinic',
		method: 'POST',
		server: server.qywx,
		origin: 'resource'
	},
	//非客户添加
	unclinicInsert: {
		apiName: 'unclinicInsert',
		url: '/unclinic/insert',
		method: 'POST',
		server: server.qywx,
		origin: 'resource'
	},
	updateContractUrl: {
		url: '/clinicCustomer/updateContractUrl',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},

	getClinicForSales: {
		url: '/clinicCustomer/getClinicForSales',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},
	// 获取销售量排名
	getSalesCountRank: {
		url: '/bd-resource/contractManager/getSalesCountOrderBy',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},
	// 根据省份查询商业公司列表
	getSupplyCompanyList: {
		url: '/bd-resource/supplyCompany/getSupplyCompanyList',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	},
	getCustomerClassifyVoTree:{
		url: '/bd-resource/customerClassify/getCustomerClassifyVoTree',
		method: 'GET',
		server: server.qywx,
		origin: 'resource'
	}

}
export default resource;
