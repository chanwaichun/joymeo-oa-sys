let requestTask = [];

export function setRequestTask(value) {
	requestTask = value;
}
// 把对应的请求放进去
export function pushRequestTask(key, request) {
	requestTask.push({
		key,
		request
	})
}

export function filterFinishedRequest(key) {
	setRequestTask(requestTask.filter(item => item.key !== key));
}

export function getRequestTask(key) {
	return requestTask
}
export function allRequestCancel(key) {
	requestTask.length && requestTask.forEach(item => item.request.abort());
	setRequestTask([]);

}
export function requestCancel(key, options) {
	const currentCancel = requestTask.find(item => item.key === key)
	if (currentCancel) {
		!options.fetchRepeat && currentCancel.request && currentCancel.request.abort();
	}
}
