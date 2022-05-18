import fieldBigData from '@/fieldMap/fieldBigData.js'
export default {
	formatFilter(currentObj, filterObj, currentPage) {
		const setDateTypeByKey = (key) => {
			if (key === 'custom') {
				return {
					startDate: filterObj.currentTime.split(' - ')[0],
					endDate: filterObj.currentTime.split(' - ')[1]
				}

			} else {
				return {
					dateType: key
				}
			}
		}
		const setDeptIdByDeptName = {
			parentDept: () => {
				if (currentPage.type === 'BD') {
					return '1'
				} else {
					return ''
				}

			},
			currentDept: () => {
				const {
					deptId
				} = uni.getStorageSync('userInfo')
				return deptId
			},
			custom: () => {
				return filterObj.deptId
			}
		}
		const setRegionIdByRegionName = {
			allRegion: () => {
				return []
			},
			custom: () => {
				return filterObj.currentRegion.map(item => item.value)
			}
		}
		const setClassifyIdByClassifyName = {
			allClassify: () => {
				return ''
			},
			custom: () => {
				const currentLength = filterObj.currentClassify.length
				return filterObj.currentClassify[currentLength - 1] ? filterObj.currentClassify[currentLength -
					1].value : '';
			}
		}
		const setDrugIdByDrugName = {
			allDrug: () => {
				return ''
			},
			custom: () => {
				return filterObj.currentDrug[0].value
			}
		}

		// if (currentPage.type === 'BD') {


		// 	return {
		// 		deptId: setDeptIdByDeptName[currentObj.currentDeptKey](),
		// 		...setDateTypeByKey(currentObj.currentTimeKey)
		// 	}
		// } else if (currentPage.type === 'HIS') {

		// 	return {
		// 		listRegion: setRegionIdByRegionName[currentObj.currentRegionKey](),
		// 		...setDateTypeByKey(currentObj.currentTimeKey)
		// 	}
		// } else {

		return {
			listRegion: setRegionIdByRegionName[currentObj.currentRegionKey](),
			deptId: setDeptIdByDeptName[currentObj.currentDeptKey](),
			classifyId: setClassifyIdByClassifyName[currentObj.currentClassifyKey](),
			drugId: setDrugIdByDrugName[currentObj.currentDrugKey](),
			...setDateTypeByKey(currentObj.currentTimeKey)
		}
		// }


	},
	setSplitNumber(data) {
		let maxValue = Math.max(...data)
		if (maxValue === 0 || data.length === 0) {
			return 1;
		}
		if (maxValue < 10) {
			for (let i = 5; i > 1; i--) {
				if (maxValue % i === 0) {
					return i;
				}
			}
			return 1
		}
		return 5
	},
	setAxisNumber(data) {
		const dataLength = data.length
		for (let i = 8; i > 1; i--) {

			if (dataLength % i === 0) {
				return i;
			}
		}
		return 1
	},
	setYAxisOptions(fieldData, seriesData) {
		return {
			splitNumber: this.setSplitNumber(seriesData.length > 0 ? seriesData[0].data : []),
			data: fieldData.map((fieldItem, index) => {
				let obj = {
					position: index === 0 ? 'left' : 'right',
					title: fieldItem.showYAxisTitle ? fieldBigData.getFieldAttribute(fieldItem.key,
						'name') : '',
					min: 0
				}
				if (fieldBigData.getFieldAttribute(fieldItem.key, 'type') === 'rate') {
					obj = {
						...obj,
						max: 100,
						unit: '%'
					}
				} else {
					obj = {
						...obj
					}
				}
				if (index === 1) {
					obj = {
						...obj,
						disabled: true
					}
				}
				return obj
			})
		}
	}
}
