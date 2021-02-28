import { NextApiRequest } from 'next'

import { DeveloperBot, DeveloperBotSchema } from '@utils/Yup'
import { get, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import RequestHandler from '@utils/RequestHandler'

import { User } from '@types'

const BotApplications = RequestHandler().patch(async (req: ApiRequest, res) => {
	const user = await get.Authorization(req.cookies.token)
	if (!user) return ResponseWrapper(res, { code: 401 })
	const csrfValidated = checkToken(req, res, req.body._csrf)
	if (!csrfValidated) return
	const validated = await DeveloperBotSchema.validate(req.body, { abortEarly: false })
		.then(el => el)
		.catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

	if (!validated) return
	const bot = await get.bot.load(req.query.id)
	if (!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
	if (!(bot.owners as User[]).find(el => el.id === user)) return ResponseWrapper(res, { code: 403 })
	await update.updateBotApplication(req.query.id, { webhook: validated.webhook || null })
	return ResponseWrapper(res, { code: 200 })
})

interface ApiRequest extends NextApiRequest {
	body: DeveloperBot
	query: {
		id: string
	}
}

export default BotApplications
