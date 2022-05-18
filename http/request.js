import globalConfig from "../config/globalConfig.js";
import {
	pushRequestTask,
	requestCancel,
	filterFinishedRequest
} from './httpCancel.js'
import util from "../utils/util.js";
// 百度接口秘钥
const baiduKey = "U3WBZ-T3566-FNRSK-M7FOY-RM6M3-S3BDC";
// const baiduSign = 'mDRaJ2pBjbkKa7r0OTTJu9P14a8VhJXk'
// 端口
// 权限名单
const authorizationOperateList = ['productInsert', 'customerInsert', 'customerUpdate', 'unclinicUpdate',
	'unclinicInsert'
];
const port = {
	public: 20001,
	admin: 20102,
	resource: 20103,
	customer: 20104,
	kpi: 20105,
	bigData: 9090,
};
// 模块
const module = {
	public: "/pub-biz-base",
	admin: "/bd-biz-admin",
	resource: "/bd-biz-resource",
	customer: "/bd-biz-customer",
	kpi: "/bd-biz-kpi",
	report: "/middle-biz-platform",
	// report: '/report-api'
};
// 域名
const realm = {
	public: "pub-gateway",
	admin: "bd-admin",
	resource: "bd-resource",
	customer: "bd-customer",
	kpi: "bd-kpi",
};

function _setRequestConfig(urlConfig, params, option) {
	const {
		// 路径
		url,
		// 请求方法
		method,
		origin,
		// 接口所对应的key
		apiName = "",
		// 接口所属于的服务 默认为空字符
		server = "",
		// 接口类型
		type = "",
		// 接口mock模拟数据 默认为空
	} = urlConfig;
	let config = {
		url: "",
		method,
		data: deleteNullKey(params),
		header: {
			"Content-Type": option.type || "application/json",
			// 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		// 十五秒超时
		timeout: 15000,
	};
	if (uni.getStorageSync("token")) {
		config.header.Authorization = uni.getStorageSync("token");
	}
	// 请求服务器
	if (type === "map") {
		config.url = `${globalConfig.mapAddress}${url}`;
		config.data = {
			...config.data,
			key: baiduKey
		};
	} else {
		config.url = `${globalConfig[`${globalConfig.mode}Address`]}${
				  module[origin]
				}${server}${url}`;
	}
	return config
}
// 删除空值的字段
function deleteNullKey(obj) {
	let newObj = obj;
	for (let key in newObj) {
		if (typeof newObj[key] !== "number" && !newObj[key]) {
			delete newObj[key];
		}
	}
	return newObj;
}
/* 
 * @params {String} key 对应api的key
 * @params {Object} condition 限制的条件
 */
function getAuthorationByCondition(key = '', condition) {
	const conditionKey = Object.keys(condition)[0];
	const userInfo = uni.getStorageSync('userInfo')
	const compareKey = () => {
		return condition[conditionKey] === userInfo[conditionKey]
	}
	return authorizationOperateList.includes(key) && compareKey()
}

function requestCatchMessage(err) {
	const translateString = (string) => {
		if (string.includes("timeout")) {
			return "服务器繁忙，请稍后再试";
		}
		return string ? string : "请求失败";

	};
	const errMessage = err.message || "";
	const errCode = err.code || "";
	if (util.getValueType(errMessage) === "Object") {
		const {
			errMsg
		} = errMessage;
		return translateString(errMsg);

		// 调用reject结束

	}
	return translateString(errMessage);

}

function request(urlConfig, params, option = {}) {

	let config = _setRequestConfig(urlConfig, params, option)
	requestCancel(config.url,option)
	return new Promise((resolve, reject) => {
		// 对符合条件的发起请求前拦截
		if (getAuthorationByCondition(urlConfig.apiName, {
				staffType: 'OPERATE'
			})) {
			reject({
				message: '暂无权限操作',
			});
			return;
		}


		const wxRequest = uni.request({
			...config,
			success: (res) => {
				filterFinishedRequest(config.url)
				//如果是百度地图的api
				if (urlConfig.type === "map") {
					const {
						status,
						result,
						message = ""
					} = res.data;
					if (status !== 0) {
						reject({
							message: message ? message : "服务器异常",
						});
					}
					resolve(res.data);
				} else {
					const {
						code,
						data,
						message = ""
					} = res.data;

					// 没有权限或者token过期重新跳转到登录页
					// 
					if (code === 401 || code === 7001) {
						reject({
							message: '暂未登录或token已经过期',
						});
						util.reLaunchToLoginPage();
					}

					// 不是200捕获错误
					if (code !== 200) {
						reject({
							message: message ? message : "服务器异常",
							code,
						});
					} else {
						// 解决数据
						resolve(res.data);
					}
				}
			},
			fail: (err) => {

				reject({
					message: err,
				});
			}
		})
		pushRequestTask(config.url, wxRequest);
		return wxRequest

	}).catch((err) => {
		// 请求完成后的错误捕获
		// err为一个对象包含Msg以及code
		uni.hideLoading();

		let errString = requestCatchMessage(err)
		if (!option.isNotNeedMsg) {
			if (!errString.includes('abort')) {
				uni.showToast({
					title: errString,
					duration: 2000,
					icon: "none",
				});
			}

		}
		return Promise.reject(errString);
	});
}
export default request;
