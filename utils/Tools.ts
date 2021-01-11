import { ImageFormat, ImageOptions, ImageSize, UserPemissionFlags } from '../types'
import { BASE_URLs, perms } from './Constants'

export function formatNumber(value: number):string  {
	const suffixes = ['', '만', '억', '조','해']
	const suffixNum = Math.floor((''+value).length/4)
	let shortValue:string|number = parseFloat((suffixNum != 0 ? (value / Math.pow(10000,suffixNum)) : value).toPrecision(2))
	if (shortValue % 1 != 0) {
		shortValue = shortValue.toFixed(1)
	}
	if(suffixNum ===  1 && shortValue < 1) return Number(shortValue) * 10 + '천'
	return shortValue+suffixes[suffixNum]
}

export function checkPerm(base: number, required: number | UserPemissionFlags):boolean {
	required = typeof required === 'number' ? required : perms[required]
	if (typeof required !== 'number' && !required) throw new Error('올바르지 않은 권한입니다.')
	return (base & required) === required
}

export function makeImageURL(root:string, { format='png', size=256 }:ImageOptions):string {
	return `${root}.${format}?size=${size}`
}