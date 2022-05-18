<template>
	<view class="page-customerDetail common-container-bottom">
		<card card-title="诊所信息">
			<u-cell-group :border="false">
				<u-cell-item v-for="(item,index) in unclinicInfo" :key="index"
					:title="fieldMap.getFieldAttribute(item,'name')" :value="getValueFromConfig(item,form[item])"
					:padding="cellItemPadding" :border-top="false" :arrow="false">
				</u-cell-item>
			</u-cell-group>
		</card>
		<fixed-btn>
			<u-button slot="right-button" type="primary" style="width: 100%" shape="circle"
				@click="clickAction('updateInfo')">修改</u-button>
		</fixed-btn>
	</view>
</template>

<script>
	import apiConfig from '@/config/apiConfig.js'
	import selectConfig from '@/config/selectConfig.js'
	import fieldMap from '@/fieldMap/fieldNormal.js'
	import utils from './utils/formInitConfig.js'

	export default {
		data() {
			return {
				fieldMap,
				unclinicInfo: [
					"unClinicName",
					"address",
					"telPhone",
					"unClinicType",
				],
				form: utils.other
			}
		},
		onShow() {
			this.urlParams = this.$util.getUrlParams()
			// 判断是否有cid这个参数
			if (this.urlParams.hasOwnProperty('id')) {
				this.getUnclinicDetail(this.urlParams.id)
			}
		},
		methods: {
			getValueFromConfig(formKey, formValue) {
				if (formValue === undefined || formValue === '') return '-'
				const selectMap = selectConfig.getMap();
				if (selectMap.hasOwnProperty(formKey)) {
					return selectMap[formKey][formValue] ?
						`${selectMap[formKey][formValue]}` :
						'-'
				}
				return this.form[formKey] ? `${this.form[formKey]}${fieldMap.getFieldAttribute(formKey,'unitCN',true)}` :
					'-'
			},
			clickAction(type) {
				const id = this.urlParams.id
				uni.navigateTo({
					url: `/pages/customer/customerAdd?type=other&id=${id}`
				})
			},
			getUnclinicDetail(id) {
				this.$requestData(apiConfig.getUnclinicDetail, {
					id
				}).then((res) => {
					this.form = res.data
				})
			}

		}
	}
</script>

<style>
</style>
