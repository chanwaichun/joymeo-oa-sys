import server from '../index.js'
const his = {
	// HIS接口
	// 昨日数据
	getHisYesterdayData: {
		url: "/report/hisYestodayData",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 新增诊所数
	getHisNewClinicStatistic: {
		url: "/report/hisNewClinicStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 签约数
	getHisCooperateStatistic: {
		url: "/report/hisCooperateStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisRecipeStatistic: {
		url: "/report/hisRecipeStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 活跃诊所&活跃率
	getHisActiveStatistic: {
		url: "/report/hisActiveStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 诊所接诊人数&平均接诊数
	getHisVisitNumStatistic: {
		url: "/report/hisVisitNumStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 累计诊所数和签约数
	getHisAccCooperateSumStatistic: {
		url: "/report/hisAccCooperateSumStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisAccRecipeSumStatistic: {
		url: "/report/hisAccRecipeSumStati",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 接诊单数排行榜
	getHisClinicVisitNumRanking: {
		url: "/report/hisClinicVisitNumRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 处方单量
	getHisClinicRecipeNumRanking: {
		url: "/report/hisClinicRecipeNumRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 运营看板
	getHisClinicCooperateNum: {
		url: "/report/hisClinicCooperateNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisClinicActiveNum: {
		url: "/report/hisClinicActiveNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisVisitNum: {
		url: "/report/hisVisitNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisRecipeNum: {
		url: "/report/hisRecipeNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	//采购分析
	// 采购分析数据概览
	getHisPurchaseAmountDataView: {
		url: "/report/hisPurchaseAmountDataView",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// GMV
	getHisPurchaseAmountGMV: {
		url: "/report/hisPurchaseAmountGMV",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisPurchaseAmount: {
		url: "/report/hisPurchaseAmount",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisPurchaseOrderNum: {
		url: "/report/hisPurchaseOrderNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisPurchaseAmountPerClinic: {
		url: "/report/hisPurchaseAmountPerClinic",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisPurchaseClinicNum: {
		url: "/report/hisPurchaseClinicNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisPurchaseRate: {
		url: "/report/hisPurchaseRate",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisPurchaseProductNum: {
		url: "/report/hisPurchaseProductNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisCityPurchaseAmountRanking: {
		url: "/report/hisCityPurchaseAmountRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisClinicPurchaseAmountRanking: {
		url: "/report/hisClinicPurchaseAmountRanking",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 1.5.1版本新增
	// 注册
	getHisLogClinicNum: {
		url: "/report/hisLogClinicNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 签约
	getHisCooperateClinicNum: {
		url: "/report/hisCooperateClinicNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 接诊
	getHisSumVisitNum: {
		url: "/report/hisSumVisitNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	
	getHisSumRecipeNum: {
		url: "/report/hisSumRecipeNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},

	getHisRecipeDrugs: {
		url: "/report/hisRecipeDrugs",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisAccLogClinicNum: {
		url: "/report/hisAccLogClinicNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisAccCooperateClinicNum: {
		url: "/report/hisAccCooperateClinicNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisAccRecipeNum: {
		url: "/report/hisAccRecipeNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
		
	getHisActiveClinicNum:{
		url: "/report/hisActiveClinicNum",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 注册诊所数明细
	getHisLogClinicNumDetail: {
		url: "/report/hisLogClinicNumDetail",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 签约诊所明细
	getHisCooperateClinicNumDetail: {
		url: "/report/hisCooperateClinicNumDetail",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisVisitNumDetail: {
		url: "/report/hisVisitNumDetail",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// 诊所处方单 明细
	getHisSumRecipeNumDetail: {
		url: "/report/hisSumRecipeNumDetail",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// his诊所处方单药品明细
	getHisRecipeDrugsDetail: {
		url: "/report/hisRecipeDrugsDetail",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	// his活跃诊所明细
	getHisActiveClinicNumDetail: {
		url: "/report/hisActiveClinicNumDetail",
		method: "POST",
		server: server.bigData,
		origin: "report",
	},
	getHisDataSummary: {
		url: "/report/hisDataSummary",
		method: "POST",
		server: server.bigData,
		origin: "report",
	}
};
export default his;
