import { IncomingMessage } from 'http'
import { NextPageContext } from 'next'

export interface Bot {
	id: string
	name: string
	flags: number
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
	web: string | null
	git: string | null
	url: string | null
	discord: string | null
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
	flags: number
	github: string
	bots: Bot[] | string[]
}

export interface BotSpec {
	id: string
	webhook: string | null
	token: string
}

export interface DocsData {
  name: string
  list?: DocsData[]
  text?: string
}

export enum UserFlags {
	general = 0 << 0,
	staff = 1 << 0,
	bughunter = 1 << 1,
	botreviewer = 1 << 2,
	premium = 1 << 3
}

export enum BotFlags {
	general = 0 << 0,
	official = 1 << 0,
	trusted = 1 << 2,
	partnered = 1 << 3,
	verifed = 1 << 4,
	premium = 1 << 5,
	hackerthon = 1 << 6,
}

export enum DiscordUserFlags {
	DISCORD_EMPLOYEE = 1 << 0,
	DISCORD_PARTNER = 1 << 1,
	HYPESQUAD_EVENTS = 1 << 2,
	BUGHUNTER_LEVEL_1 = 1 << 3,
	HOUSE_BRAVERY = 1 << 6,
	HOUSE_BRILLIANCE = 1 << 7,
	HOUSE_BALANCE = 1 << 8,
	EARLY_SUPPORTER = 1 << 9,
	TEAM_USER = 1 << 10,
	SYSTEM = 1 << 12,
	BUGHUNTER_LEVEL_2 = 1 << 14,
	VERIFIED_BOT = 1 << 16,
	VERIFIED_DEVELOPER = 1 << 17,
}

export interface BotList {
	type: ListType
	data: Bot[]
	currentPage: number
	totalPage: number
}

export interface SubmittedBot {
	id: string
	date: number
	owners: User[]
	lib: Library
	prefix: string
	intro: string
	desc: string
	category: Category[]
	web: string | null
	git: string | null
	url: string | null
	discord: string | null
	state: number
	reason: string | null
}

export interface DiscordTokenInfo {
	access_token?: string
	expires_in?: number
	refresh_token?: string
	scope?: string
	token_type?: string
	error?: string
}

export interface GithubTokenInfo {
	access_token?: string
	scope?: string
	token_type?: string
	error?: string
}

export interface TokenRegister {
	id: string
	access_token: string
	expires_in: number
	refresh_token: string
	email: string
	username: string
	discriminator: string
}

export interface DiscordUserInfo {
	id: string
	username: string
	avatar: string
	discriminator: string
	public_flags: number
	flags: number
	email: string
	verified: boolean
	locale: string
	mfa_enabled: boolean
	premium_type: 0 | 1 | 2
}

export interface UserCache {
	id: string
	version: number
	username: string
	tag: string
}

export type Theme = 'dark' | 'light' | 'system'

export type Status = 'online' | 'offline' | 'dnd' | 'idle' | 'streaming' | null

export type BotState = 'ok' | 'reported' | 'blocked' | 'archived' | 'private'

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

export type ImageFormat = 'webp' | 'png' | 'jpg' | 'gif'
export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
export interface ImageOptions {
	format?: ImageFormat
	size?: ImageSize
}

export interface KoreanbotsImageOptions {
	format?: 'webp' | 'png' | 'gif'
	size?: 128 | 256 | 512
}

export enum DiscordImageType {
	EMOJI = 'emoji',
	GUILD = 'guild',
	USER = 'user',
	FALLBACK = 'default',
}

export interface CsrfContext extends NextPageContext {
	req?: CsrfRequestMessage
}

export interface CsrfRequestMessage extends IncomingMessage {
	csrfToken(): string
}

export interface ResponseProps<T = Data> {
	code?: number
	message?: string
	version?: number
	data?: T
	errors?: string[]
}

interface Data<T = unknown> {
	[key: string]: T
}
