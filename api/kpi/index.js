import server from '../index.js'
// #考核模块
const kpi = {
	getBannerData: {
		url: '/kpi/target/banner',
		method: 'GET',
		server: server.qywx,
		origin: 'kpi',
	},
	getSaleInfo: {
		url: '/kpi/target/sale/info',
		method: 'GET',
		server: server.qywx,
		origin: 'kpi',
	},
	getAccessList: {
		url: '/kpi/report/plan/list',
		method: 'GET',
		server: server.qywx,
		origin: 'kpi',
	},
	getDraftDetail: {
		url: '/kpi/report/plan/draft/detail/get',
		method: 'GET',
		server: server.qywx,
		origin: 'kpi',
	},
	saveDraftDetail: {
		url: '/kpi/report/plan/draft/detail/save',
		method: 'POST',
		server: server.qywx,
		origin: 'kpi',
	},
	saveAccessPlan: {
		url: '/kpi/report/plan/draft/detail/submit',
		method: 'GET',
		server: server.qywx,
		origin: 'kpi',
	}

}
export default kpi