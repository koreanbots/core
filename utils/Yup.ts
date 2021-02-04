import * as Yup from 'yup'
import YupKorean from 'yup-locales-ko'
import { ListType } from '../types'
import { categories, library } from './Constants'
import { HTTPProtocol, ID, Prefix, Url, Vanity } from './Regex'

Yup.setLocale(YupKorean)

export const botListArgumentSchema: Yup.SchemaOf<botListArgument> = Yup.object({
	type: Yup.mixed().oneOf(['VOTE', 'TRUSTED', 'NEW', 'PARTNERED', 'CATEGORY', 'SEARCH']).required(),
	page: Yup.number().positive().integer().notRequired().default(1),
	query: Yup.string().notRequired()
})

export interface botListArgument  {
	type: ListType
	page?: number
	query?: string
}

export const ImageOptionsSchema: Yup.SchemaOf<ImageOptions> = Yup.object({
	id: Yup.string().required(),
	ext: Yup.mixed<ext>().oneOf(['webp', 'png', 'gif']).required(),
	size: Yup.mixed<ImageSize>().oneOf(['128', '256', '512']).required()
})

interface ImageOptions {
	id: string
	ext: ext
	size: ImageSize
}

type ext = 'webp' | 'png' | 'gif'
type ImageSize = '128' | '256' | '512'

export const PageCount = Yup.number().integer().positive().required()

export const OauthCallbackSchema: Yup.SchemaOf<OauthCallback> = Yup.object({
	code: Yup.string().required()
})

export const botCategoryListArgumentSchema: Yup.SchemaOf<botCategoryListArgument> = Yup.object({
	page: PageCount,
	category: Yup.mixed().oneOf(categories).required()
})

interface botCategoryListArgument {
	page: number
	category: string
}
interface OauthCallback {
	code: string
}

export const SearchQuerySchema: Yup.SchemaOf<SearchQuery> = Yup.object({
	q: Yup.string().min(2, '최소 2글자 이상 입력해주세요.').required()
})

interface SearchQuery {
	q: string
}

export const AddBotSubmitSchema = Yup.object({
	agree: Yup.boolean().oneOf([true], '상단의 체크박스를 클릭해주세요.').required('상단의 체크박스를 클릭해주세요.'),
	id: Yup.string().matches(ID, '올바른 봇 ID를 입력해주세요.').required('봇 ID는 필수 항목입니다.'),
	prefix: Yup.string().matches(Prefix, '접두사는 띄어쓰기로 시작할 수 없습니다.').min(1, '접두사는 최소 1자여야합니다.').max(32, '접두사는 최대 32자까지만 가능합니다.').required('접두사는 필수 항목입니다.'),
	library: Yup.string().oneOf(library).required('라이브러리는 필수 항목입니다.'),
	website: Yup.string().matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.').matches(Url, '올바른 웹사이트 URL을 입력해주세요.'),
	url: Yup.string().matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.').matches(Url, '올바른 초대링크 URL을 입력해주세요.'),
	git: Yup.string().matches(HTTPProtocol, 'http:// 또는 https:// 로 시작해야합니다.').matches(Url, '올바른 깃 URL을 입력해주세요.'),
	discord: Yup.string().matches(Vanity, '디스코드 초대코드 형식을 지켜주세요.').min(2, '지원 디스코드는 최소 2자여야합니다.').max(32, '지원 디스코드는 최대 32자까지만 가능합니다.'),
	category: Yup.array(Yup.string().oneOf(categories)).min(1, '최소 한 개의 카테고리를 선택해주세요.').required('카테고리는 필수 항목입니다.'),
	intro: Yup.string().min(2, '봇 소개는 최소 2자여야합니다.').max(60, '봇 소개는 최대 60자여야합니다.').required('봇 소개는 필수 항목입니다.'),
	desc: Yup.string().min(100, '봇 설명은 최소 100자여야합니다.').max(1500, '봇 설명은 최대 1500자여야합니다.').required('봇 설명은 필수 항목입니다.')
})


export default Yup