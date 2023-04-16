import { NextApiRequest } from 'next'
import rateLimit from 'express-rate-limit'
import { EmbedBuilder } from 'discord.js'

import { get, update } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { BotStatUpdate, BotStatUpdateSchema } from '@utils/Yup'
import { getStatsLoggingChannel } from '@utils/DiscordBot'
import { checkUserFlag, makeDiscordCodeblock } from '@utils/Tools'
import { KoreanbotsEndPoints } from '@utils/Constants'
import { User, WebhookType } from '@types'
import { sendWebhook } from '@utils/Webhook'

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000,
	max: 3,
	statusCode: 429,
	skipFailedRequests: true,
	handler: (_req, res) => ResponseWrapper(res, { code: 429 }),
	keyGenerator: (req) => req.headers.authorization,
	skip: (req, res) => {
		res.removeHeader('X-RateLimit-Global')
		if(!req.headers.authorization) return true
		else return false
	}
})

const patchLimiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 6,
	statusCode: 429,
	skipFailedRequests: true,
	handler: (_req, res) => ResponseWrapper(res, { code: 429 }),
	keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	skip: (_req, res) => {
		res.removeHeader('X-RateLimit-Global')
		return false
	}
})

const BotStats = RequestHandler().post(limiter)
	.post(async (req: PostApiRequest, res) => {
		const bot = await get.BotAuthorization(req.headers.authorization)
		if(!bot) return ResponseWrapper(res, { code: 401 })
		if(!req.body) return ResponseWrapper(res, { code: 400 })
		const validated: BotStatUpdate = await BotStatUpdateSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})

		if(!validated) return
		const botInfo = await get.bot.load(req.query.id)
		if(!botInfo) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		if(botInfo.id !== bot) return ResponseWrapper(res, { code: 403 })
		const d = await update.updateServer(botInfo.id, validated.servers, validated.shards)
		if(d===1 || d===2) return ResponseWrapper(res, { code: 403, message: `서버 수를 ${[null, '1만', '100만'][d]} 이상으로 설정하실 수 없습니다. 문의해주세요.` })
		get.bot.clear(req.query.id)
		if (validated.servers && botInfo.servers !== validated.servers) {
			sendWebhook(botInfo, {
				type: 'bot',
				data: {
					botId: botInfo.id,
					type: WebhookType.ServerCountChange,
					before: botInfo.servers,
					after: validated.servers,
				}
			})
		}
		await getStatsLoggingChannel().send({
			content: `[BOT/STATS] <@${botInfo.id}> (${botInfo.id})\n${makeDiscordCodeblock(`${botInfo.servers > validated.servers ? '-' : '+'} ${botInfo.servers} -> ${validated.servers} (${botInfo.servers > validated.servers ? '▼' : '▲'}${Math.abs(validated.servers - botInfo.servers)})`, 'diff')}`, 
			embeds: [new EmbedBuilder().setDescription(`${botInfo.name} - <@${botInfo.id}> ([${botInfo.id}](${KoreanbotsEndPoints.URL.bot(botInfo.id)}))`)]
		})
		return ResponseWrapper(res, { code: 200, message: '성공적으로 업데이트 했습니다.'})
	})
	.patch(patchLimiter).patch(async (req: ApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const userinfo = await get.user.load(user)
		const bot = await get.bot.load(req.query.id)
		if(!bot) return ResponseWrapper(res, { code: 404 })
		if(!(bot.owners as User[]).find(el => el.id === user) && !checkUserFlag(userinfo.flags, 'staff')) return ResponseWrapper(res, { code: 403 })
		get.bot.clear(req.query.id)
		return ResponseWrapper(res, { code: 200 })
	})


interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}
interface PostApiRequest extends ApiRequest {
  query: {
    id: string
  }
  body: BotStatUpdate
}

export default BotStats