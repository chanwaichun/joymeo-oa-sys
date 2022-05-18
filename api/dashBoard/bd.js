
import server from '../index.js'
const bd = {
  getYesterday: {
    url: "/report/yestodayData",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 获取新增诊所数对应的数据表
  getNewClinicStatistic: {
    url: "/report/newClinicStati",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 获取登录人数对应的数据表
  getSignStatistic: {
    url: "/report/signStati",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 获取打卡人数对应的数据表
  getClockNumStatistic: {
    url: "/report/clockNumStati",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 获取货款报备金额对应的数据表
  getPaymentStatistic: {
    url: "/report/paymentStati",
    method: "POST",
    origin: "report",
    server: server.bigData,
  },
  getBadSaleRanking: {
    url: "/report/saleBadRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 销售量排行榜
  getSaleRanking: {
    url: "/report/sealeRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  getSumSaleRanking: {
    url: "/report/sumSaleRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },

  // 销售量当前排名
  getUserSaleRanking: {
    url: "/report/userSealeRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  getAllSaleRanking: {
    url: "/report/allSealeRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 客户量当前排名
  getUserClientRanking: {
    url: "/report/userClientRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  // 客户量排行榜
  getClientRanking: {
    url: "/report/clientRanking",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  getClockRankingView: {
    url: "/report/clockRankingView",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
  getClockDataView: {
    url: "/report/clockDataView",
    method: "POST",
    server: server.bigData,
    origin: "report",
  },
};
export default bd;
