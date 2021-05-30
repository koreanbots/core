import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'

import { BotList } from '@types'

const NewList = RequestHandler().get(async (_req, res) => {
	const result = await get.list.new.load(1)
	return ResponseWrapper<BotList>(res, { code: 200, data: result })
})

export default NewList