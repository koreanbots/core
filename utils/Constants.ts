import { ImageOptions, KoreanbotsImageOptions } from '@types'
import { makeImageURL } from './Tools'

export const Status = {
	online: {
		text: '온라인',
		color: 'green-400',
	},
	idle: {
		text: '자리 비움',
		color: 'yellow-300',
	},
	dnd: {
		text: '다른 용무중',
		color: 'red-500',
	},
	offline: {
		text: '오프라인',
		color: 'gray-500',
	},
	streaming: {
		text: '방송중',
		color: 'purple-500'
	},
	null: {
		text: '알 수 없음',
		color: 'gray-500',
	},
	'???': {
		text: '알 수 없음',
		color: 'gray-500',
	},
}

export const perms = {
	general: 0x0,
	staff: 0x1,
	bughunter: 0x4,
	booster: 0x8,
}

export const libs = [
	'discord.js',
	'Eris',
	'discord.py',
	'discordcr',
	'Nyxx',
	'Discord.Net',
	'DSharpPlus',
	'Nostrum',
	'coxir',
	'DiscordGo',
	'Discord4J',
	'Javacord',
	'JDA',
	'Discordia',
	'RestCord',
	'Yasmin',
	'disco',
	'discordrb',
	'serenity',
	'SwiftDiscord',
	'Sword',
	'기타',
	'비공개',
]
export const cats = [
	'관리',
	'뮤직',
	'전적',
	'웹 대시보드',
	'로깅',
	'도박',
	'게임',
	'밈',
	'레벨링',
	'유틸리티',
	'번역',
	'대화',
	'NSFW',
	'검색',
]
export const reportCats = [
	'불법',
	'괴롭힘, 모욕, 명예훼손',
	'스팸, 도배, 의미없는 텍스트',
	'폭력, 자해, 테러 옹호하거나 조장하는 컨텐츠',
	'라이선스혹은 권리 침해',
	'Discord ToS 위반',
	'Koreanbots 가이드라인 위반',
	'기타',
]

export const BASE_URLs = {
	api: 'https://discord.com/api',
	cdn: 'https://cdn.discordapp.com'
}
export const DiscordEnpoints = {
	Token: BASE_URLs.api + '/oauth2/token',
	Me: BASE_URLs.api + '/v8/users/@me',
	CDN: class CDN {
		static root = BASE_URLs.cdn
		static emoji (id: string, options:ImageOptions={}) { return makeImageURL(`${this.root}/emojis/${id}`, options) }
		static guild (id: string, hash: string, options:ImageOptions={}) { return makeImageURL(`${this.root}/icons/${id}/${hash}`, options) }
		static default (tag: string|number, options:ImageOptions={}) { return makeImageURL(`${this.root}/embed/avatars/${!isNaN(Number(tag)) ? Number(tag) % 5 : 0}`, options) }
		static user (id: string, hash: string, options:ImageOptions={}) { return makeImageURL(`${this.root}/avatars/${id}/${hash}`, options) }
	}
}

export const KoreanbotsEndPoints = {
	CDN: class CDN {
		static avatar (id: string, options: KoreanbotsImageOptions) { return makeImageURL(`/api/image/discord/avatars/${id}`, options) }
	}
}

export const Oauth = {
	discord: (clientID: string, scope: string) => `https://discord.com/oauth2/authorize?client_id=${clientID}&scope=${scope}&permissions=0&response_type=code&redirect_uri=${process.env.KOREANBOTS_URL}/api/auth/discord/callback&prompt=none`
}
export const git = { 'github.com': { icon: 'github', text: 'Github' },  'gitlab.com':  { icon: 'gitlab', text: 'Gitlab' }}

export const ErrorText = {
	DEFAULT: '예상치 못한 에러가 발생하였습니다.',
	200: '문제가 없는데 여기를 어떻게 오셨죠?',
	400: '올바르지 않은 요청입니다.',
	401: '로그인이 필요합니다.',
	402: '결제가 필요합니다.',
	403: '권한이 없습니다.',
	404: '페이지가 존재하지 않습니다.',
	405: '해당 요청 방법은 허용되지 않습니다.',
	406: '연결을 받아드릴 수 없습니다.',
	429: '지정된 시간에 너무 많은 요청을 보내셨습니다.',
	500: '서버 내부 오류가 발생하였습니다.',
	502: '올바르지 않은 게이트웨이입니다.'
}
