const tabMixin = {
	data() {
		return {
			isCanUpdate: false,
			pageParams: {
				pageNum: 1,
				pageSize: 20
			}
		}
	},
	// 用于每次tab外的page打开时，刷新内部的组件
	methods: {
		// 页面onshow的时候发布onShow
		_tabPageShow_mixins() {
			uni.$emit('onShow')
		},
		// 页面组件取消订阅页面onshow
		_tabComShow_off_mixins() {
			uni.$off('onShow')
		},
		// 页面组件订阅页面onshow
		_tabComShow_on_mixins(callback) {
			uni.$on('onShow', () => callback())
			callback()
		},
		// 页面触底的时候发布onReachBottom
		_tabPageReachBottom_mixins() {
			uni.$emit('onReachBottom')
		},
		// 页面触底的时候调用页面加一
		_tabPageReachBottom_on_mixins(reachCallback) {
			if (this.isCanUpdate) {
				this.pageParams.pageNum += 1;
				reachCallback();
			}
		},
		_tabPageReachBottom_off_mixins()
		{
			uni.$off('rankFilter')
			uni.$off('contentFilter')
		},
		/*  
		 * target {Array} 目标数据 
		 * data {Array} 需要合并的数据 
		 * dataCallback {Function} 合并数据时候的回调
		 * noDataCallback {Function} 数据为空时候的回调 
		 */
		_tabReachBottom_dataUpadte_mixins(target = [], data = []) {
			return new Promise((resolve, reject) => {
				if (data.length >= this.pageParams.pageSize) {
					resolve(target.concat(data));
				} else {
					this.isCanUpdate = false;
					resolve(target.concat(data));
				}
			})

		},
		// 页面组件订阅onReachBottom
		_tabComReachBottom_on_mixins(reachCallback, isNotUpdatePage = false) {


			uni.$on('onReachBottom', () => {
				if (this.isCanUpdate) {
					if (!isNotUpdatePage) {
						this.pageParams.pageNum += 1;
					}

					reachCallback();
				}
			})
		},

		// 页面组件取消订阅onReachBottom
		_tabComReachBottom_off_mixins() {
			uni.$off('onReachBottom')
		},
		// 页面发布onHide
		_tabPageHide_mixins() {
			uni.$emit('onHide')
		},
		// 页面组件订阅onHide
		_tabComHide_on_mixins(callback) {
			uni.$on('onHide', () => callback())
		},
		// 页面组件取消订阅onHide
		_tabComHide_off_mixins() {
			uni.$off('onHide')
		}
	}

}
export default tabMixin
