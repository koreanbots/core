import * as Yup from 'yup'
import YupKorean from 'yup-locales-ko'
import { ListType } from '../types'

Yup.setLocale(YupKorean)

export const botListArgumentSchema = Yup.object({
	type: Yup.string().oneOf(['VOTE', 'TRUSTED', 'NEW', 'PARTNERED', 'CATEGORY', 'SEARCH']).required(),
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

export const PageCount = Yup.number().integer().positive()

interface ImageOptions {
	id: string
	ext: ext
	size: ImageSize
}

type ext = 'webp' | 'png' | 'gif'
type ImageSize = '128' | '256' | '512'


export default Yup