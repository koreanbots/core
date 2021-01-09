import * as Yup from 'yup'
import YupKorean from 'yup-locales-ko'
import { ListType } from '../types'

Yup.setLocale(YupKorean)

export const botListArgumentSchema = Yup.object({
	type: Yup.string().oneOf(['VOTE', 'TRUSTED', 'NEW', 'PARTNERED', 'CATEGORY', 'SEARCH']).required(),
	page: Yup.number().positive().integer().optional().default(1),
	query: Yup.string().optional()
})

export interface botListArgument extends Yup.Asserts<typeof botListArgumentSchema>  {
	type: ListType
} 
export default Yup