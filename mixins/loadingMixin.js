const loadingMixin = {
	data() {
		return {
			pageLoading :true
		}
	},
	methods: {
		setLoading_loading_mixin(status) {
			this.pageLoading = status;
		}
	}

}
export default loadingMixin;
