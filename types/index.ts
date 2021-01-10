export type UserPemissionFlags = 'general' | 'staff' | 'bughunter' | 'booster'

export interface Bot {
	id: string
	name: string
	state: BotState
	tag: string
	avatar: string
	status: Status
	lib: Library
	prefix: string
	votes: number
	servers: number
	intro: string
	desc: string
	category: Category[]
	web?: string
	git?: string
	url?: string
	discord?: string
	verified: boolean
	trusted: boolean
	partnered: boolean
	vanity: string | null
	bg: string
	banner: string
	owners: User[] | string[]
}

export interface User {
	id: string
	avatar: string
	tag: string
	username: string
	perm: number
	github: string
	bots: Bot[] | string[]
}

export interface BotList {
	type: ListType
	data: Bot[]
	currentPage: number
	totalPage: number
}

export type Status = 'online' | 'offline' | 'dnd' | 'idle' | 'streaming' | null

export type BotState = 'ok' | 'reported' | 'archived' | 'private'

export type Library =
	| 'discord.js'
	| 'Eris'
	| 'discord.py'
	| 'discordcr'
	| 'Nyxx'
	| 'Discord.Net'
	| 'DSharpPlus'
	| 'Nostrum'
	| 'coxir'
	| 'DiscordGo'
	| 'Discord4J'
	| 'Javacord'
	| 'JDA'
	| 'Discordia'
	| 'RestCord'
	| 'Yasmin'
	| 'disco'
	| 'discordrb'
	| 'serenity'
	| 'SwiftDiscord'
	| 'Sword'
	| '기타'
	| '비공개'

export type Category =
	| '관리'
	| '뮤직'
	| '전적'
	| '웹 대시보드'
	| '로깅'
	| '도박'
	| '게임'
	| '밈'
	| '레벨링'
	| '유틸리티'
	| '번역'
	| '대화'
	| 'NSFW'
	| '검색'

export type ReportCategory =
	| '불법'
	| '괴롭힘, 모욕, 명예훼손'
	| '스팸, 도배, 의미없는 텍스트'
	| '폭력, 자해, 테러 옹호하거나 조장하는 컨텐츠'
	| '라이선스혹은 권리 침해'
	| 'Discord ToS 위반'
	| 'Koreanbots 가이드라인 위반'
	| '기타'

export type ListType = 'VOTE' | 'TRUSTED' | 'NEW' | 'PARTNERED' | 'CATEGORY' | 'SEARCH'
