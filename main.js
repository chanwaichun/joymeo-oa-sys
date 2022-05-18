import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import uView from 'uview-ui'
import moment from 'miment'
import FixedBtn from './components/FixedBtn/FixedBtn.vue'
import PageLoading from './components/PageLoading/PageLoading.vue'
import PageEmpty from './components/PageEmpty/PageEmpty.vue'
import SearchInput from './components/SearchInput/SearchInput.vue'
import requestData from './http/request.js'
// import requestData from './utils/requestData.js'
import globalConfig from './config/globalConfig.js'
import util from './utils/util.js'
import dashBoardUtil from './utils/dashBoardUtil.js'
Vue.config.productionTip = false
Vue.use(uView)
Vue.component('fixed-btn', FixedBtn)
Vue.component('page-loading', PageLoading)
Vue.component('page-empty', PageEmpty)
Vue.component('SearchInput', SearchInput)
Vue.prototype.$moment = moment;
Vue.prototype.$global = globalConfig
Vue.prototype.$requestData = requestData;
Vue.prototype.$util = util;
Vue.prototype.$dashBoardUtil = dashBoardUtil;
App.mpType = 'app'
const app = new Vue({
	...App
})

app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
