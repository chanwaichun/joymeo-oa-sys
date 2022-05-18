import server from '../index.js'
const income = {
	getIncomeAmountData: {
		url: "/report/incomeAmountData",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseAmountGMV: {
		url: "/report/incomePurchaseAmountGMV",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseProductAmount: {
		url: "/report/incomePurchaseProductAmount",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseAmount: {
		url: "/report/incomePurchaseAmount",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseOrderList: {
		url: "/report/incomePurchaseOrderList",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseAmountPerClinicList: {
		url: "/report/incomePurchaseAmountPerClinicList",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseClinicNumList: {
		url: "/report/incomePurchaseClinicNumList",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomePurchaseRateList: {
		url: "/report/incomePurchaseRateList",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomeCityPurchaseAmountRanking: {
		url: "/report/incomeCityPurchaseAmountRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getIncomeClinicPurchaseAmountRanking: {
		url: "/report/incomeClinicPurchaseAmountRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	}
}
export default income;
