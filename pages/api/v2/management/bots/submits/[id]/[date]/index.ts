import { NextApiRequest } from 'next'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get } from '@utils/Query'
import { DiscordBot } from '@utils/DiscordBot'

const BotSubmit = RequestHandler().get(async (req: ApiRequest, res) => {
	const bot = await get.BotAuthorization(req.headers.authorization)
	if (bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
	const submit = await get.botSubmit.load(
		JSON.stringify({ id: req.query.id, date: req.query.date })
	)
	if (!submit) return ResponseWrapper(res, { code: 404 })
	return ResponseWrapper(res, { code: 200, data: submit })
})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
		date: string
	}
}

export default BotSubmit
