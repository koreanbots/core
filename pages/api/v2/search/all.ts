import { NextApiRequest } from 'next'

import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { SearchQuerySchema } from '@utils/Yup'

import { Bot, Server, List } from '@types'

const Search = RequestHandler().get(async (req: ApiRequest, res) => {
	const validated = await SearchQuerySchema.validate({ q: req.query.q || req.query.query, page: 1 })
		.then((el) => el)
		.catch((e) => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
		})
	if (!validated) return

	let botResult: List<Bot>
	let serverResult: List<Server>
	try {
		botResult = await get.list.search.load(
			JSON.stringify({ page: validated.page, query: validated.q })
		)
		serverResult = await get.serverList.search.load(
			JSON.stringify({ page: validated.page, query: validated.q })
		)
	} catch {
		return ResponseWrapper(res, { code: 400, message: '검색 문법이 잘못되었습니다.' })
	}
	return ResponseWrapper<{ bots: Bot[]; servers: Server[] }>(res, {
		code: 200,
		data: { bots: botResult?.data || [], servers: serverResult?.data || [] },
	})
})

interface ApiRequest extends NextApiRequest {
	query: {
		q?: string
		query?: string
	}
}

export default Search
