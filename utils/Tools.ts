import { Readable } from 'stream'
import { NextPageContext } from 'next'
import cookie from 'cookie'

import { ImageOptions, UserPemissionFlags } from '@types'
import { KoreanbotsEndPoints, Oauth, perms } from './Constants'
import { NextRouter } from 'next/router'

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

export function supportsWebP() {
	const elem = document.createElement('canvas')
	if (elem.getContext && elem.getContext('2d')) {
		// was able or not to get WebP representation
		return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
	}
	// very old browser like IE 8, canvas not supported
	return false
}

export function checkBrowser() {
	const ua = navigator.userAgent
	let tem
	let M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+(\.\d+)?(\.\d+)?)/i) || []
	if(/trident/i.test(M[1])){
		tem=/\brv[ :]+(\d+)/g.exec(ua) || []
		return 'IE '+(tem[1] || '')
	}
	if(M[1]=== 'Chrome'){
		tem= ua.match(/\b(OPR|Edge|Whale)\/(\d+)/)
		if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera')
	}
	M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?']
	if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1])
	return M.join(' ')
}

export function generateOauthURL(provider: 'discord', clientID: string, scope: string) {
	return Oauth[provider](clientID, scope)
}

export function formData(details: { [key: string]: string | number | boolean }) {
	const formBody = []
	for (const property in details) {
		const encodedKey = encodeURIComponent(property)
		const encodedValue = encodeURIComponent(details[property])
		formBody.push(encodedKey + '=' + encodedValue)
	}
	return formBody.join('&')
	
}

export function bufferToStream(binary: Buffer) {

	const readableInstanceStream = new Readable({
		read() {
			this.push(binary)
			this.push(null)
		}
	})

	return readableInstanceStream
}

export function parseCookie(ctx: NextPageContext): { [key: string]: string } {
	return cookie.parse(ctx.req.headers.cookie || '')
}

export function redirectTo(router: NextRouter, to: string) {
	router.push(KoreanbotsEndPoints[to] || to)
	return
}

export { anchorHeader, twemoji } from './ShowdownExtensions'