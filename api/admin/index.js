import server from '../index.js'
const admin = {
	getDeptData: {
		url: '/bd-admin/structure/getAdminStructureTreeListByParentIdForWeChat',
		method: 'GET',
		server: server.qywx,
		origin: 'admin',
	}
}
export default admin