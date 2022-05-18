import server from '../index.js'
const otc = {
	getOtcSalesDataView: {
		url: "/report/otcSalesDataView",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getOtcCustomerRanking:{
		url: "/report/otcCustomerRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getOtcRegionRanking:{
		url: "/report/otcReginRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getOtcDeptRanking:{
		url: "/report/otcDeptRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
}
export default otc
