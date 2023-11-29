import { NextApiRequest } from 'next'
import { Colors, EmbedBuilder } from 'discord.js'
import tracer from 'dd-trace'

import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get, update } from '@utils/Query'
import { DiscordBot, webhookClients } from '@utils/DiscordBot'
import { BotSubmissionDenyReasonPresetsName, KoreanbotsEndPoints } from '@utils/Constants'

const DenyBotSubmit = RequestHandler().post(async (req: ApiRequest, res) => {
	const bot = await get.BotAuthorization(req.headers.authorization)
	if (bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
	const submit = await get.botSubmit.load(
		JSON.stringify({ id: req.query.id, date: req.query.date })
	)
	if (!submit) return ResponseWrapper(res, { code: 404 })
	if (submit.state !== 0)
		return ResponseWrapper(res, { code: 400, message: '대기 중이지 않은 아이디입니다.' })
	await update.denyBotSubmission(submit.id, submit.date, req.body.reason)
	get.botSubmit.clear(JSON.stringify({ id: req.query.id, date: req.query.date }))
	const embed = new EmbedBuilder()
		.setTitle('거부')
		.setColor(Colors.Red)
		.setDescription(
			`[${submit.id}/${submit.date}](${KoreanbotsEndPoints.URL.submittedBot(
				submit.id,
				submit.date
			)})`
		)
		.setTimestamp()
	if (req.body.reviewer || req.body.reason)
		embed.addFields({
			name: '📃 정보',
			value: `${
				req.body.reason
					? `사유: ${BotSubmissionDenyReasonPresetsName[req.body.reason] || req.body.reason}\n`
					: ''
			}${req.body.reviewer ? `심사자: ${req.body.reviewer}` : ''}`,
		})
	await webhookClients.internal.reviewLog.send({ embeds: [embed] })
	const openEmbed = new EmbedBuilder()
		.setTitle('거부')
		.setColor(Colors.Red)
		.setDescription(`<@${submit.id}> (${submit.id})`)
		.setTimestamp()
	if (req.body.reason)
		openEmbed.addFields({
			name: '📃 사유',
			value: `${
				req.body.reason
					? `${BotSubmissionDenyReasonPresetsName[req.body.reason] || req.body.reason}\n`
					: '없음'
			}`,
		})
	await webhookClients.internal.openReviewLog.send({ embeds: [openEmbed] })
	tracer.trace('botSubmits.deny', (span) => {
		span.setTag('id', submit.id)
		span.setTag('date', submit.date)
		span.setTag('reviewer', req.body.reviewer)
		span.setTag('reason', BotSubmissionDenyReasonPresetsName[req.body.reason] || 'OTHER')
		span.setTag('_raw_reason', req.body.reason)
	})
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
