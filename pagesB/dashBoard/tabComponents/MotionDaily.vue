<template>
	<view class="motionDaily">
		<DashBoardCard api="getHisClinicCooperateNum" :seriesName="['cooperateRate']"
			:fieldData="[{key:'cooperateClinicNum',showLastDay:true}]" type="arcbar" cardTitle="HIS门诊签约数">
		</DashBoardCard>
		<DashBoardCard api="getHisClinicActiveNum" :seriesName="['activeRate']"
			:fieldData="[{key:'activeClinicNum',showLastDay:true}]" type="arcbar" cardTitle="活跃诊所">
		</DashBoardCard>
		<DashBoardCard api="getHisVisitNum" :seriesName="['visitRate']" :fieldData="[{key:'visitNum',showLastDay:true}]"
			type="arcbar" cardTitle="接诊单">
		</DashBoardCard>
		<DashBoardCard api="getHisRecipeNum" :fieldData="[{key:'recipeNum',showLastDay:true}]"
			:seriesName="['recipeRate']" type="arcbar" cardTitle="处方单">
		</DashBoardCard>
	</view>
</template>

<script>
	import DashBoardCard from '../components/common/DashBoardCard.vue'
	export default {
		components: {
			DashBoardCard,
			data() {
				return {

				}
			}
		}
	}
</script>

<style>
</style>
