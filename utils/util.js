import moment from "miment";
import globalConfig from "@/config/globalConfig.js";
export default {
	// 获取标准当前时间
	getCurrentTime() {
		return moment().format("YYYY-MM-DD hh:mm:ss");
	},
	// 根据格式返回对应格式的日期
	getCommonTime(time, format) {
		return time ? moment(time).format(`YYYY${format}MM${format}DD`) : "-";
	},
	getCommonTimeCn(time) {
		return time ? moment(time).format(`YYYY年MM月DD日`) : "-";
	},
	// 获取数值的JavaScript类型
	getValueType(value) {
		let string = Object.prototype.toString
			.call(value)
			.split(" ")[1]
			.split("]")[0];
		return string;
	},
	translateTimeByUnit(time, target) {
		if (target === "day") {
			return time / 1000 / 60 / 60 / 24;
		}
	},
	/*
	 * @params {Number} obj 地区编码
	 */
	// 对象参数转化为字符串
	paramsObjectToString(obj) {
		const checkIsTime = (key, value) => {
			// 定制化操作不需要看
			if (key.toLocaleLowerCase().includes("time")) {
				return moment(value).stamp();
			} else if (this.getValueType(value) === 'Object') {
				return JSON.stringify(value)
			} else {
				return value || "";
			}
		};
		return Object.keys(obj).reduce((prev, currentKey, index) => {
			return `${index === 0 ? "?" : `${prev}&`}${currentKey}=${checkIsTime(
        currentKey,
        obj[currentKey]
      )}`;
		}, "");
	},
	getLastPage() {
		const pages = getCurrentPages();
		return pages[pages.length - 1]
	},
	//重新打开登录页
	reLaunchToLoginPage() {
		const currentPage = this.getLastPage();
		const loginTarget = currentPage.$page.fullPath;
		getApp().globalData.userRegionData = []
		if (!loginTarget.includes('/pages/login/login')) {
			uni.reLaunch({
				url: `/pages/login/login?targetUrl=${loginTarget}`,
			});
		}

	},
	// 获取当前页面参数
	getUrlParams() {
		return this.getLastPage().options;
	},
	/*
	 * @params {Number} code 地区编码
	 * @params {String} type 地区类型
	 */
	getAreaCode(code, type) {
		const codeStr = String(code);
		const getOtherZero = (num) => {
			let string = "";
			for (let i = 0; i < num; i++) {
				string += "0";
			}
			return string;
		};
		const codeObj = {
			province: Number(`${codeStr.slice(0, 2)}${getOtherZero(10)}`),
			city: Number(`${codeStr.slice(0, 4)}${getOtherZero(8)}`),
			district: Number(`${codeStr.slice(0, 6)}${getOtherZero(6)}`),
			township: Number(codeStr.slice(0, 12)),
		};
		if (type) {
			return codeObj[type];
		} else {
			return codeObj;
		}
	},
	getAreaCodeByArray(array) {
		const [province, city, district, township] = array
		return {
			province,
			city,
			district,
			township
		}
	},
	/*
	 * @params {Function} callback 回调函数
	 * @params {Boolean} isLoading {true：需要让用户感知加载} {false：不需要让用户感知加载}
	 */
	getRigonData(callback, isLoading) {
		// 防止多次请求城市列表
		isLoading &&
			uni.showLoading({
				title: "地区信息加载中",
			});
		// 如果数据为空以及请求没有进行则发起请求
		if (
			getApp().globalData.regionData.length === 0 &&
			getApp().globalData.isGettingData === false
		) {
			getApp().globalData.isGettingData = true;
			uni.request({
				url: `${globalConfig.staticAddress}/json/region_qywx_V_2.json`,
				enableCache: true,
				method: "GET",
				success: (res) => {

					uni.hideLoading();
					getApp().globalData.regionData = res.data;
					getApp().globalData.isGettingData = false;
					// 发布消息让订阅的页面接收到数据
					uni.$emit("onGetRigonData", getApp().globalData.regionData);
					callback && callback(res.data);
				},
				fail: (res) => {
					getApp().globalData.isGettingData = false;
					isLoading &&
						this.$util.showToast({
							title: "地区信息获取失败,请重新进入页面",
							icon: "none",
						});
					// uni.navigateBack()
				},
			});
		} else {
			uni.hideLoading();
			// 如果数据已经获取到了数据
			callback && callback(getApp().globalData.regionData);
		}
	},
	/*
	 * @params {Array} data 目标数据
	 * @params {Array} target 过滤条件
	 */
	filterRegionData(data, target) {

		let newData = data.map(item => {
			if (item.hasOwnProperty('children')) {

				return {
					...item,
					children: this.setChildren(item, target)
				}
			} else {
				return this.setLastLevel(item, target)
			}

		}).filter(filterItem => {
			if (filterItem.hasOwnProperty('children')) {
				return filterItem.children
			} else {
				return filterItem
			}
		})
		// console.log(newData)
		return newData
	},
	// 设置最后一级无children的
	setLastLevel(item, target) {
		let regionId = this.regionRemoveZero(String(item.value), this.checkLevel(String(item.value)))
		let targetIndex = target.findIndex(targetItem => targetItem.includes(regionId));
		if (targetIndex === -1) {
			return '';
		}
		return item
	},
	setChildren(item, target) {

		let regionId = this.regionRemoveZero(String(item.value), this.checkLevel(String(item.value)))
		let targetIndex = target.findIndex(targetItem => targetItem.includes(regionId));
		if (targetIndex === -1) {
			return '';
		}
		if (target[targetIndex].length - 1 == this.checkLevel(String(item.value))) {
			return item.children;
		}

		return this.filterRegionData(item.children, target);
	},
	// 判断属于第几级
	checkLevel(code) {
		let arr = []
		let canPush = false
		let codeArr = String(code).split('').reverse();
		codeArr.forEach(item => {
			if (canPush) {
				arr.unshift(item)
			} else if (Number(item) > 0) {
				canPush = true;
				arr.unshift(item);
			}
		})
		if (arr.length <= 2) {
			return 0
		}
		if (arr.length <= 4) {
			return 1
		}
		if (arr.length <= 6) {
			return 2
		}
		if (arr.length <= 9) {
			return 3
		}
	},
	// 把非零的code提取出来
	regionRemoveZero(code, index) {
		if (index === 0) {
			return code.slice(0, 2)
		}
		if (index === 1) {
			return code.slice(0, 4)
		}
		if (index === 2) {
			return code.slice(0, 6)
		}
		if (index === 3) {
			return code.slice(0, 9)
		}
	},
	// 二次封装消息弹窗
	showToast(config) {
		uni.showToast({
			duration: 2500,
			...config,
		});
	},
	// 获取坐标之前的距离
	getMapDistanceApi(from, to) {
		var lng1 = from.lng;
		var lat1 = from.lat;
		var lng2 = to.lng;
		var lat2 = to.lat;

		var radLat1 = (lat1 * Math.PI) / 180.0;
		var radLat2 = (lat2 * Math.PI) / 180.0;
		var a = radLat1 - radLat2;
		var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
		var s =
			2 *
			Math.asin(
				Math.sqrt(
					Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
				)
			);
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;

		s = s * 1000;

		if (isNaN(s)) {
			return 0;
		}
		return s;
	},
	// 设置价格缩略
	setPriceAbridge(price) {
		if (price > 10000) {
			// 不作四舍五入的处理
			let [pointLeft, pointRight] = String(price / 10000).split(".");
			pointRight = pointRight.slice(0, 2);
			return `${pointLeft}.${pointRight}W`;
		}
		return price;
	},
	// 小程序检查定位授权
	checkAuthorizationInfo() {
		wx.getSetting({
			success: (res) => {
				if (!res.authSetting["scope.userLocation"]) {
					//打开提示框，提示前往设置页面
					this.showToast({
						title: "位置未授权，前往设置页面设置",
						icon: "none",
					});
				}
			},
		});
	},
	// 检查是否是整数
	checkInteger(value) {
		if (String(value) === "0") {
			return true;
		} else {
			return /^[1-9][0-9]*$/.test(String(value));
		}
	},
	// 检查电话号码是否正确
	checkMobile(value) {
		let valueStr = String(value);
		let pattern =
			/^(13[0-9]|14[01456789]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
		return pattern.test(valueStr);
	},
	sortDataByKey(data, keyName, isUp) {

		return data.sort((a, b) => {
			let x = a[keyName];
			let y = b[keyName];
			return x > y ? (isUp ? 1 : -1) : x < y ? (isUp ? -1 : 1) : 0;
		})
	}
};
