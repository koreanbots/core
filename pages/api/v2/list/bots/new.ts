import { get } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'

import { Bot, List } from '@types'

const NewList = RequestHandler().get(async (req, res) => {
	const auth = req.headers.authorization
		? await get.BotAuthorization(req.headers.authorization)
		: await get.Authorization(req.cookies.token)
	if (!auth) return ResponseWrapper(res, { code: 401 })
	const result = await get.list.new.load(1)
	return ResponseWrapper<List<Bot>>(res, { code: 200, data: result })
})

export default NewList
