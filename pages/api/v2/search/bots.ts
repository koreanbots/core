import { NextApiRequest, NextApiResponse } from 'next'

import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { SearchQuerySchema } from '@utils/Yup'

import { BotList } from '@types'

const SearchBots = RequestHandler().get(async (req: ApiRequest, res: NextApiResponse) => {
	const validated = await SearchQuerySchema.validate({ q: req.query.q, page: req.query.page })
		.then(el => el)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
		})
	if (!validated) return

	let result: BotList
	try {
		result = await get.list.search.load(
			JSON.stringify({ page: validated.page, query: validated.q })
		)
	} catch {
		return ResponseWrapper(res, { code: 400, message: '검색 문법이 잘못되었습니다.' })
	}
	if (result.totalPage < validated.page || result.currentPage !== validated.page)
		return ResponseWrapper(res, { code: 404, message: '검색 결과가 없습니다.' })
	else ResponseWrapper<BotList>(res, { code: 200, data: result })
})

interface ApiRequest extends NextApiRequest {
	query: {
		q: string
		page: string
	}
}

export default SearchBots
