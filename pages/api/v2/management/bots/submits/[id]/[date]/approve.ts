import { NextApiRequest } from 'next'
import { MessageEmbed } from 'discord.js'
import tracer from 'dd-trace'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get, update } from '@utils/Query'
import { DiscordBot, getBotReviewLogChannel } from '@utils/DiscordBot'
import { KoreanbotsEndPoints } from '@utils/Constants'

const ApproveBotSubmit = RequestHandler()
	.post(async (req: ApiRequest, res) => {
		const bot = await get.BotAuthorization(req.headers.authorization)
		if(bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
		const submit = await get.botSubmit.load(JSON.stringify({ id: req.query.id, date: req.query.date }))
		if(!submit) return ResponseWrapper(res, { code: 404 })
		if(submit.state !== 0) return ResponseWrapper(res, { code: 400, message: '대기 중이지 않은 아이디입니다.' })
		const result = await update.approveBotSubmission(submit.id, submit.date)
		if(!result) return ResponseWrapper(res, { code: 400 })
		get.botSubmit.clear(JSON.stringify({ id: req.query.id, date: req.query.date }))
		get.bot.clear(req.query.id)
		const embed = new MessageEmbed().setTitle('승인').setColor('GREEN').setDescription(`[${submit.id}/${submit.date}](${KoreanbotsEndPoints.URL.submittedBot(submit.id, submit.date)})`).setTimestamp()
		if(req.body.reviewer) embed.addField('📃 정보', `심사자: ${req.body.reviewer}`)
		await getBotReviewLogChannel().send(embed)
		await tracer.trace('botSubmits.approve', (async span => {
			span.setTag('id', submit.id)
			span.setTag('date', submit.date)
			span.setTag('reviewer', req.body.reviewer)
		}))
		return ResponseWrapper(res, { code: 200 })
	})

interface ApiRequest extends NextApiRequest {
  query: {
    id: string
    date: string
  }
  body: {
		reviewer?: string
  }
}

export default ApproveBotSubmit