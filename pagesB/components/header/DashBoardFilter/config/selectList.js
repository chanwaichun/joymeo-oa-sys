export default {
	timeList: [{
			name: '今天',
			key: 'today'
		}, {
			name: '昨天',
			key: 'yesterday'
		}, {
			name: '近7天',
			key: 'n7days'
		}, {
			name: '近30天',
			key: 'n30days'
		}, 
		// {
		// 	name: '本周',
		// 	key: 'tweek'
		// }, {
		// 	name: '上周',
		// 	key: 'lweek'
		// }, 
		{
			name: '本月',
			key: 'tmonth'
		},
		{
			name: '上月',
			key: 'lmonth'
		}, {
			name: '自定义时间',
			key: 'custom'
		}
	],
	regionList: [{
			name: '全国',
			key: 'allRegion'
		},
		{
			name: '选择区域',
			key: 'custom'
		}
	],
	deptList: [{
		name: '总部',
		key: 'parentDept'
	}, {
		name: '本部门',
		key: 'currentDept'
	}, {
		name: '选择部门',
		key: 'custom'
	}],
	drugList: [{
		name: '全部',
		key: 'allDrug'
	}, {
		name: '选择药品',
		key: 'custom'
	}],
	classifyList: [{
		name: '全部',
		key: 'allClassify',
	}, {
		name: '选择分类',
		key: 'custom',
	}],
}
