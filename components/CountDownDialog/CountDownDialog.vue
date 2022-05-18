<template>
	<!-- <view>22</view> -->
	<u-modal v-model="modalShow" :showTitle="showTitle" :content="content" @confirm="confirm()">
		<view slot="confirm-button">确认（{{count}}s）</view>
	</u-modal>
</template>

<script>
	let timer = null
	let defaultCount = 3
	export default {
		data() {
			return {
				modalShow: this.show,
				count: defaultCount
			}
		},
		props: {
			content: {
				type: String,
				default: '请输入提示文本'
			},
			show: {
				type: Boolean,
				default: false
			},
			showTitle: {
				type: Boolean,
				default: true
			}

		},
		watch: {
			show(val) {
				if (val) {
					this.count = defaultCount;
					timer = setInterval(() => {
						this.count -= 1
						if (this.count === 0) {
							this.modalShow = false;
							this.$emit('countFinish')
						}
					}, 1000)
				}
				this.modalShow = val


			},

			modalShow(val) {
				if (!val) {
					clearInterval(timer)
					timer = null;
				}
				this.$emit('update:show', val)
			}
		},
		methods: {
			confirm() {
				this.$emit('countFinish')
			},
		}

	}
</script>

<style lang="less">

</style>
