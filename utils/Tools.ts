import { UserPemissionFlags } from '../types'
import { perms } from './Constants'

function formatNumber(num: number, digits = 1) {
	const si = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: '천' },
		{ value: 1e4, symbol: '만' },
		{ value: 1e8, symbol: '억' },
		{ value: 1e12, symbol: '조' },
		{ value: 1e16, symbol: '해' },
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

function checkPerm(base: number, required: number | UserPemissionFlags) {
	required = typeof required === 'number' ? required : perms[required]
	if (typeof required !== 'number' && !required) throw new Error('올바르지 않은 권한입니다.')
	return (base & required) === required
}

export { formatNumber, checkPerm }
