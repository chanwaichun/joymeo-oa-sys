const formMixin = {
	data() {
		return {
			errorType: ['toast']
		}
	},
	onReady() {
		this.rules && this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		//封装post调用接口的方法,
		onSubmit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.formSubmit()
				}
			})


		}
	}
}
export default formMixin;
