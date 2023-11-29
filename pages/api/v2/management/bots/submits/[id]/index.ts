import { NextApiRequest } from 'next'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get } from '@utils/Query'
import { DiscordBot } from '@utils/DiscordBot'

const BotSubmit = RequestHandler().get(async (req: ApiRequest, res) => {
	const bot = await get.BotAuthorization(req.headers.authorization)
	if (bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
	const submits = await get.botSubmitList()
	const submit = submits.find((el, n) => el.id === req.query.id || n + 1 === Number(req.query.id))
	if (!submit) return ResponseWrapper(res, { code: 404 })
	return ResponseWrapper(res, { code: 200, data: submit })
})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}
export default BotSubmit
