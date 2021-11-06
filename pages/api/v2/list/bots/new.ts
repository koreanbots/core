import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'

import { Bot, List } from '@types'

const NewList = RequestHandler().get(async (_req, res) => {
	const result = await get.list.new.load(1)
	return ResponseWrapper<List<Bot>>(res, { code: 200, data: result })
})

export default NewList