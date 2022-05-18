import server from '../index.js'
// #公共模块
const pub = {
	// 发送短信
	sendMessage: {
		url: '/sms/send',
		method: 'GET',
		origin: 'public',
	}
}
export default pub;
