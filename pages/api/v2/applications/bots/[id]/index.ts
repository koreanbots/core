import { NextApiRequest } from 'next'

import { DeveloperBot, DeveloperBotSchema } from '@utils/Yup'
import { get, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import RequestHandler from '@utils/RequestHandler'

import { User, WebhookStatus } from '@types'
import { parseWebhookURL } from 'discord.js'
import { verifyWebhook } from '@utils/Webhook'

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
	if(validated.webhookURL) {
		const key = await verifyWebhook(validated.webhookURL)
		if(key === false) {
			return ResponseWrapper(res, { code: 400, message: '웹후크 주소를 검증할 수 없습니다.', errors: ['웹후크 주소가 올바른지 확인해주세요.\n웹후크 주소 검증에 대한 자세한 내용은 API 문서를 참고해주세요.'] })
		}
		await update.webhook(req.query.id, 'bots', { 
			url: validated.webhookURL,
			status: parseWebhookURL(validated.webhookURL) ? WebhookStatus.Discord : WebhookStatus.HTTP,
			failedSince: null,
			secret: key,
		})
	} else {
		await update.webhook(req.query.id, 'bots', { 
			url: null,
			status: WebhookStatus.None,
			failedSince: null,
			secret: null,
		})
	}
	return ResponseWrapper(res, { code: 200 })
})

interface ApiRequest extends NextApiRequest {
	body: DeveloperBot
	query: {
		id: string
	}
}

export default BotApplications
