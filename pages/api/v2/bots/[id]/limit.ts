import { NextApiRequest } from 'next'

import { KoreanbotsEndPoints } from '@utils/Constants'
import { checkToken } from '@utils/Csrf'
import { discordLog } from '@utils/DiscordBot'
import { CaptchaVerify, get, update } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkUserFlag, makeDiscordCodeblock } from '@utils/Tools'
import { ExceedLimit, ExceedLimitScehma } from '@utils/Yup'
import { EmbedBuilder } from 'discord.js'

const BotLimit = RequestHandler().patch(async (req: PostApiRequest, res) => {
	const user = await get.Authorization(req.cookies.token)
	if (!user) return ResponseWrapper(res, { code: 401 })
	const userinfo = await get.user.load(user)
	const bot = await get.bot.load(req.query.id)
	if (!bot) return ResponseWrapper(res, { code: 404 })
	if (!checkUserFlag(userinfo.flags, 'staff')) return ResponseWrapper(res, { code: 403 })

	const validated = await ExceedLimitScehma.validate(req.body, { abortEarly: false })
		.then((el) => el)
		.catch((e) => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})
	if (!validated) return
	const csrfValidated = checkToken(req, res, validated._csrf)
	if (!csrfValidated) return
	const captcha = await CaptchaVerify(validated._captcha)
	if (!captcha) return

	await update.updateServer(
		bot.id,
		validated.servers,
		validated.shards == 0 ? undefined : validated.shards,
		true
	)
	get.user.clear(user)

	await discordLog(
		'BOT/EXCEED_LIMIT',
		userinfo.id,
		new EmbedBuilder().setDescription(
			`${bot.name} - <@${bot.id}> ([${bot.id}](${KoreanbotsEndPoints.URL.bot(bot.id)}))`
		),
		null,
		makeDiscordCodeblock(
			`${bot.servers > validated.servers ? '-' : '+'} ${bot.servers} -> ${validated.servers} (${bot.servers > validated.servers ? '▼' : '▲'}${Math.abs(validated.servers - bot.servers)})\n` +
				`${validated.servers >= 1000000 ? '+ 서버수 제한 해제 (1000000+)\n' : ''}` +
				`${validated.servers >= 10000 && validated.servers < 1000000 ? '+ 서버수 제한 해제 (10000+)\n' : ''}` +
				`${validated.shards >= 200 ? '+ 샤드수 제한 해제\n' : ''}`,
			'diff'
		)
	)
	return ResponseWrapper(res, { code: 200 })
})

interface PostApiRequest extends NextApiRequest {
	query: {
		id: string
	}
	body: ExceedLimit
}

export default BotLimit
