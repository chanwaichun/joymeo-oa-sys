import dashBoard from '../api/dashBoard/index.js'
import baiduMap from '../api/baiduMap/index.js'
import pub from '../api/pub/index.js'
import customer from '../api/customer/index.js'
import resource from '../api/resource/index.js'
import kpi from '../api/kpi/index.js'
import admin from '../api/admin/index.js'
const apiConfig = {
	dashBoard,
	baiduMap,
	pub,
	customer,
	resource,
	admin,
	kpi,
	...dashBoard,
	// 百度地图
	...baiduMap,
	// 公共
	...pub,
	// 资源
	...customer,
	// 资源
	...resource,
	// 组织架构
	...admin,
	// 考核
	...kpi,
}
export default apiConfig
