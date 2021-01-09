import * as Yup from 'yup'

export const botListArgument = Yup.object({
	type: Yup.string().oneOf(['VOTE', 'TRUSTED', 'NEW', 'PARTNERED', 'CATEGOORY', 'SEARCH']).required(),
	page: Yup.number().positive().integer().optional().default(1),
	query: Yup.string().optional()
})

export default Yup