import { NextApiRequest } from 'next'
import { MessageEmbed } from 'discord.js'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get, update } from '@utils/Query'
import { DiscordBot, getBotReviewLogChannel } from '@utils/DiscordBot'
import { BotSubmissionDenyReasonPresetsName, KoreanbotsEndPoints } from '@utils/Constants'

const DenyBotSubmit = RequestHandler()
	.post(async (req: ApiRequest, res) => {
		const bot = await get.BotAuthorization(req.headers.authorization)
		if(bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
		const submit = await get.botSubmit.load(JSON.stringify({ id: req.query.id, date: req.query.date }))
		if(!submit) return ResponseWrapper(res, { code: 404 })
		if(submit.state !== 0) return ResponseWrapper(res, { code: 400, message: '대기 중이지 않은 아이디입니다.' })
		await update.denyBotSubmission(submit.id, submit.date, req.body.reason)
		get.botSubmit.clear(JSON.stringify({ id: req.query.id, date: req.query.date }))
		const embed = new MessageEmbed().setTitle('거부').setColor('RED').setDescription(`[${submit.id}/${submit.date}](${KoreanbotsEndPoints.URL.submittedBot(submit.id, submit.date)})`).setTimestamp()
		if(req.body.reviewer || req.body.reason) embed.addField('📃 정보', `${req.body.reason ? `사유: ${BotSubmissionDenyReasonPresetsName[req.body.reason] || req.body.reason}\n`: ''}${req.body.reviewer ? `심사자: ${req.body.reviewer}` : ''}`)
		await getBotReviewLogChannel().send(embed)
		return ResponseWrapper(res, { code: 200 })
	})

interface ApiRequest extends NextApiRequest {
  query: {
    id: string
    date: string
  }
  body: {
    reason?: string
		reviewer: string
  }
}

export default DenyBotSubmit