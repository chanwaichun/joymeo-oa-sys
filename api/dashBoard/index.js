import bd from './bd.js';
import his from './his.js'
import otc from './otc.js'
import income from './income.js'
const dashBoard = {
	...income,
	...bd,
	...his,
	...otc,
	bd,
	his,
	otc,
	income
}
export default dashBoard;
