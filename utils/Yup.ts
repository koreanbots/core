import * as Yup from 'yup'
import YupKorean from 'yup-locales-ko'
import { ListType } from '@types'
import { categories, library, reportCats } from '@utils/Constants'
import { HTTPProtocol, ID, Prefix, Url, Vanity } from '@utils/Regex'

Yup.setLocale(YupKorean)
Yup.addMethod(Yup.array, 'unique', function(message, mapper = a => a) {
	return this.test('unique', message || 'array must be unique', function(list) {
		return list.length === new Set(list.map(mapper)).size
	})
})

export const botListArgumentSchema: Yup.SchemaOf<botListArgument> = Yup.object({
	type: Yup.mixed()
		.oneOf(['VOTE', 'TRUSTED', 'NEW', 'PARTNERED', 'CATEGORY', 'SEARCH'])
		.required(),
	page: Yup.number()
		.positive()
		.integer()
		.notRequired()
		.default(1),
	query: Yup.string().notRequired(),
})

export interface botListArgument {
	type: ListType
	page?: number
	query?: string
}

export const ImageOptionsSchema: Yup.SchemaOf<ImageOptions> = Yup.object({
	id: Yup.string().required(),
	ext: Yup.mixed<ext>()
		.oneOf(['webp', 'png', 'gif'])
		.required(),
	size: Yup.mixed<ImageSize>()
		.oneOf(['128', '256', '512'])
		.required(),
})

interface ImageOptions {
	id: string
	ext: ext
	size: ImageSize
}

type ext = 'webp' | 'png' | 'gif'
type ImageSize = '128' | '256' | '512'

export const WidgetOptionsSchema: Yup.SchemaOf<WidgetOptions> = Yup.object({
	id: Yup.string().required(),
	ext: Yup.mixed<widgetExt>()
		.oneOf(['svg'])
		.required(),
	type: Yup.mixed<widgetType>()
		.oneOf(['votes', 'servers', 'status'])
		.required(),
	scale: Yup.number()
		.positive()
		.min(0.5)
		.max(3)
		.required(),
	style: Yup.mixed<'flat' | 'classic'>()
		.oneOf(['flat', 'classic'])
		.default('flat'),
	icon: Yup.boolean().default(true),
})

interface WidgetOptions {
	id: string
	ext: widgetExt
	type: widgetType
	scale: number
	style: 'flat' | 'classic'
	icon: boolean
}

type widgetType = 'votes' | 'servers' | 'status'
type widgetExt = 'svg'

export const PageCount = Yup.number()
	.integer()
	.positive()
	.required()

export const OauthCallbackSchema: Yup.SchemaOf<OauthCallback> = Yup.object({
	code: Yup.string().required(),
})

export const botCategoryListArgumentSchema: Yup.SchemaOf<botCategoryListArgument> = Yup.object({
	page: PageCount,
	category: Yup.mixed()
		.oneOf(categories)
		.required(),
})

interface botCategoryListArgument {
	page: number
	category: string
}

interface OauthCallback {
	code: string
}

export const SearchQuerySchema: Yup.SchemaOf<SearchQuery> = Yup.object({
	q: Yup.string()
		.min(2, '최소 2글자 이상 입력해주세요.')
		.max(50)
		.required('검색어를 입력해주세요.')
		.label('검색어'),
	page: Yup.number()
		.positive()
		.integer()
		.notRequired()
		.default(1)
		.label('페이지'),
})

interface SearchQuery {
	q: string
	page: number
}

export const AddBotSubmitSchema: Yup.SchemaOf<AddBotSubmit> = Yup.object({
	agree: Yup.boolean()
		.oneOf([true], '상단의 체크박스를 클릭해주세요.')
		.required('상단의 체크박스를 클릭해주세요.'),
	id: Yup.string()
		.matches(ID, '올바른 봇 ID를 입력해주세요.')
		.required('봇 ID는 필수 항목입니다.'),
	prefix: Yup.string()
		.matches(Prefix, '접두사는 띄어쓰기로 시작할 수 없습니다.')
		.min(1, '접두사는 최소 1자여야합니다.')
		.max(32, '접두사는 최대 32자까지만 가능합니다.')
		.required('접두사는 필수 항목입니다.'),
	library: Yup.string()
		.oneOf(library)
		.required('라이브러리는 필수 항목입니다.'),
	website: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 웹사이트 URL을 입력해주세요.')
		.max(64, 'URL은 최대 64자까지만 가능합니다.'),
	url: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 초대링크 URL을 입력해주세요.')
		.max(128, 'URL은 최대 128자까지만 가능합니다.'),
	git: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 깃 URL을 입력해주세요.')
		.max(64, 'URL은 최대 64자까지만 가능합니다.'),
	discord: Yup.string()
		.matches(Vanity, '디스코드 초대코드 형식을 지켜주세요.')
		.min(2, '지원 디스코드는 최소 2자여야합니다.')
		.max(32, '지원 디스코드는 최대 32자까지만 가능합니다.'),
	category: Yup.array(Yup.string().oneOf(categories))
		.min(1, '최소 한 개의 카테고리를 선택해주세요.')
		.unique('카테고리는 중복될 수 없습니다.')
		.required('카테고리는 필수 항목입니다.'),
	intro: Yup.string()
		.min(2, '봇 소개는 최소 2자여야합니다.')
		.max(60, '봇 소개는 최대 60자여야합니다.')
		.required('봇 소개는 필수 항목입니다.'),
	desc: Yup.string()
		.min(100, '봇 설명은 최소 100자여야합니다.')
		.max(1500, '봇 설명은 최대 1500자여야합니다.')
		.required('봇 설명은 필수 항목입니다.'),
	_csrf: Yup.string().required(),
	_captcha: Yup.string().required()
})

export interface AddBotSubmit {
	agree: boolean
	id: string
	prefix: string
	library: string
	website?: string
	url?: string
	git?: string
	discord?: string
	category: string | string[]
	intro: string
	desc: string
	_csrf: string
	_captcha?: string
}

export const BotStatUpdateSchema: Yup.SchemaOf<BotStatUpdate> = Yup.object({
	servers: Yup.number()
		.positive('서버 수는 양수여야합니다.')
		.integer('서버 수는 정수여야합니다.')
		.required()
})

export interface BotStatUpdate {
	servers: number
}

export const ReportSchema: Yup.SchemaOf<Report> = Yup.object({
	category: Yup.mixed().oneOf(reportCats, '신고 구분은 필수 항목입니다.').required('신고 구분은 필수 항목입니다.'),
	description: Yup.string().min(100, '최소 100자여야합니다.').max(1500, '1500자 이하로 입력해주세요.').required('설명은 필수 항목입니다.'),
	_csrf: Yup.string()
})

export interface Report {
	category: string
	description: string
	_csrf: string
}

export const ManageBotSchema: Yup.SchemaOf<ManageBot> = Yup.object({
	prefix: Yup.string()
		.matches(Prefix, '접두사는 띄어쓰기로 시작할 수 없습니다.')
		.min(1, '접두사는 최소 1자여야합니다.')
		.max(32, '접두사는 최대 32자까지만 가능합니다.')
		.required('접두사는 필수 항목입니다.'),
	library: Yup.string()
		.oneOf(library)
		.required('라이브러리는 필수 항목입니다.'),
	website: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 웹사이트 URL을 입력해주세요.')
		.max(64, 'URL은 최대 64자까지만 가능합니다.'),
	url: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 초대링크 URL을 입력해주세요.')
		.max(128, 'URL은 최대 128자까지만 가능합니다.'),
	git: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 깃 URL을 입력해주세요.')
		.max(64, 'URL은 최대 64자까지만 가능합니다.'),
	discord: Yup.string()
		.matches(Vanity, '디스코드 초대코드 형식을 지켜주세요.')
		.min(2, '지원 디스코드는 최소 2자여야합니다.')
		.max(32, '지원 디스코드는 최대 32자까지만 가능합니다.'),
	category: Yup.array(Yup.string().oneOf(categories))
		.min(1, '최소 한 개의 카테고리를 선택해주세요.')
		.unique('카테고리는 중복될 수 없습니다.')
		.required('카테고리는 필수 항목입니다.'),
	intro: Yup.string()
		.min(2, '봇 소개는 최소 2자여야합니다.')
		.max(60, '봇 소개는 최대 60자여야합니다.')
		.required('봇 소개는 필수 항목입니다.'),
	desc: Yup.string()
		.min(100, '봇 설명은 최소 100자여야합니다.')
		.max(1500, '봇 설명은 최대 1500자여야합니다.')
		.required('봇 설명은 필수 항목입니다.'),
	_csrf: Yup.string().required(),
})

export interface ManageBot {
	prefix: string
	library: string
	website: string
	url: string
	git: string
	discord: string
	category: string[]
	intro: string
	desc: string
	_csrf: string
}

export const CsrfCaptchaSchema: Yup.SchemaOf<CsrfCaptcha> = Yup.object({
	_csrf: Yup.string().required(),
	_captcha: Yup.string().required()
})

export interface CsrfCaptcha {
	_csrf: string
	_captcha: string
}

export const DeveloperBotSchema: Yup.SchemaOf<DeveloperBot> = Yup.object({
	webhook: Yup.string()
		.matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.')
		.matches(Url, '올바른 웹훅 URL을 입력해주세요.')
		.max(150, 'URL은 최대 150자까지만 가능합니다.'),
	_csrf: Yup.string().required(),
})

export interface DeveloperBot {
	webhook: string | null
	_csrf: string
}

export const ResetBotTokenSchema: Yup.SchemaOf<ResetBotToken> = Yup.object({
	token: Yup.string().required(),
	_csrf: Yup.string().required(),
})

export interface ResetBotToken {
	token: string
	_csrf: string
}

export const EditBotOwnerSchema: Yup.SchemaOf<EditBotOwner> = Yup.object({
	owners: Yup.array(Yup.string())
		.min(1, '최소 한 명의 소유자는 입력해주세요.')
		.max(10, '소유자는 최대 10명까지만 가능합니다.')
		.unique('소유자 아이디는 중복될 수 없습니다.')
		.required('소유자는 필수 항목입니다.'),
	_csrf: Yup.string().required(),
	_captcha: Yup.string().required()
})

export interface EditBotOwner {
	owners: string[]
	_csrf: string
	_captcha: string
}

export default Yup
