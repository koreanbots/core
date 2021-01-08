import * as Query from './Query'
import * as Constants from './Constants'
import ResponseWrapper from './ResponseWrapper'
import Fetch from './Fetch'

function formatNumber(num:number, digits=1) {
	const si = [
		{ value: 1, symbol: '' },
		{ value: 1E3, symbol: '천' },
		{ value: 1E4, symbol: '만' },
		{ value: 1E8, symbol: '억' },
		{ value: 1E12, symbol: '조' },
		{ value: 1E16, symbol: '해' }
	]
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
	let i
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}


export { Query, Constants, Fetch, ResponseWrapper, formatNumber }
