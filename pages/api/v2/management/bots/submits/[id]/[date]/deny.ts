import { NextApiRequest } from 'next'
import { MessageEmbed } from 'discord.js'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get, update } from '@utils/Query'
import { DiscordBot, getBotReviewLogChannel } from '@utils/DiscordBot'
import { KoreanbotsEndPoints } from '@utils/Constants'

const DenyBotSubmit = RequestHandler()
	.post(async (req: ApiRequest, res) => {
		const bot = await get.BotAuthorization(req.headers.authorization)
		if(bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
		const submit = await get.botSubmit.load(JSON.stringify({ id: req.query.id, date: req.query.date }))
		if(!submit) return ResponseWrapper(res, { code: 404 })
		await update.denyBotSubmission(submit.id, submit.date, req.body.reason)
		get.botSubmit.clear(JSON.stringify({ id: req.query.id, date: req.query.date }))
		await getBotReviewLogChannel().send(new MessageEmbed().setTitle('거부 됨').setColor('RED').setDescription(`[${submit.id}/${submit.date}](${KoreanbotsEndPoints.URL.submittedBot(submit.id, submit.date)})`).setTimestamp())
		return ResponseWrapper(res, { code: 200 })
	})

interface ApiRequest extends NextApiRequest {
  query: {
    id: string
    date: string
  }
  body: {
    reason?: string
  }
}

export default DenyBotSubmit