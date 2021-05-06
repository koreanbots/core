import { createHmac } from 'crypto'
import { Readable } from 'stream'
import cookie from 'cookie'

import { BotFlags, ImageOptions, UserFlags } from '@types'
import { BASE_URLs, KoreanbotsEndPoints, Oauth } from './Constants'
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

function checkFlag(base: number, required: number) {
	return (base & required) === required
}

export function checkUserFlag(base: number, required: number | keyof typeof UserFlags):boolean {
	return checkFlag(base, typeof required === 'number' ? required : UserFlags[required])
}

export function checkBotFlag(base: number, required: number | keyof typeof BotFlags):boolean {
	return checkFlag(base, typeof required === 'number' ? required : BotFlags[required])
}

export function makeImageURL(root:string, { format='png', size=256 }:ImageOptions):string {
	return `${root}.${format}?size=${size}`
}

export function makeBotURL({id, vanity, flags=0}: { flags?: number, vanity?:string, id: string }): string {
	return `/bots/${(checkBotFlag(flags, 'trusted') || checkBotFlag(flags, 'partnered')) && vanity ? vanity : id}`
}

export function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data))
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

export function systemTheme() {
	try {
		return window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
	} catch {
		return 'dark'
	}
}

export function checkBrowser(): string {
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

export function generateOauthURL(provider: 'discord'|'github', clientID: string, scope?: string) {
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

export function parseCookie(req?: { headers: { cookie?: string }}): { [key: string]: string } {
	if(!req) return {}
	return cookie.parse(req.headers.cookie || '')
}

export function redirectTo(router: NextRouter, to: string) {
	router.push(KoreanbotsEndPoints[to] || to)
	return
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanObject<T extends Record<any, any>>(obj: T): T {
	for (const propName in obj) {
		if (obj[propName] !== 0 && !obj[propName]) {
			delete obj[propName]
		}
	}
	return obj
}

export function camoUrl(url: string): string {
	return BASE_URLs.camo + `/${HMAC(url)}/${toHex(url)}`
}

export function HMAC(value: string, secret=process.env.CAMO_SECRET):string|null {
	try {
		return createHmac('sha1', secret).update(value, 'utf8').digest('hex')
	}
	catch {
		return null
	}
}

export function toHex(value: string): string {
	return Buffer.from(value).toString('hex')
}

export function getRandom<T=unknown>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)]
}

export * from './ShowdownExtensions'