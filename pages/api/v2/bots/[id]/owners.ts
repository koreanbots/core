import { NextApiRequest } from 'next'

import RequestHandler from '@utils/RequestHandler'
import { CaptchaVerify, get, update } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import { checkUserFlag, diff, makeDiscordCodeblock } from '@utils/Tools'
import { EditBotOwner, EditBotOwnerSchema } from '@utils/Yup'
import { User } from '@types'
import { discordLog } from '@utils/DiscordBot'
import { EmbedBuilder } from 'discord.js'
import { KoreanbotsEndPoints } from '@utils/Constants'

const BotOwners = RequestHandler()
	.patch(async (req: PostApiRequest, res) => {
		const user = await get.Authorization(req.cookies.token)
		if (!user) return ResponseWrapper(res, { code: 401 })
		const userinfo = await get.user.load(user)
		const bot = await get.bot.load(req.query.id)
		if(!bot) return ResponseWrapper(res, { code: 404 })
		if((bot.owners as User[])[0].id !== user && !checkUserFlag(userinfo.flags, 'staff')) return ResponseWrapper(res, { code: 403 })
		if(['reported', 'blocked', 'archived'].includes(bot.state) && !checkUserFlag(userinfo.flags, 'staff')) return ResponseWrapper(res, { code: 403, message: '해당 봇은 수정할 수 없습니다.', errors: ['오류라고 생각되면 문의해주세요.'] })
		const validated = await EditBotOwnerSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})
		if(!validated) return
		const csrfValidated = checkToken(req, res, validated._csrf)
		if (!csrfValidated) return
		const captcha = await CaptchaVerify(validated._captcha)
		if(!captcha) return
		const userFetched: User[] = await Promise.all(validated.owners.map((u: string) => get.user.load(u)))
		if(userFetched.indexOf(null) !== -1) return ResponseWrapper(res, { code: 400, message: '올바르지 않은 유저 ID를 포함하고 있습니다.' })
		if(userFetched.length > 1 && userFetched[0].id !== (bot.owners as User[])[0].id) return ResponseWrapper(res, { code: 400, errors: ['소유자를 이전할 때는 다른 관리자를 포함할 수 없습니다.'] })
		await update.botOwners(bot.id, validated.owners)
		get.user.clear(user)
		await discordLog('BOT/OWNERS', userinfo.id, (new EmbedBuilder().setDescription(`${bot.name} - <@${bot.id}> ([${bot.id}](${KoreanbotsEndPoints.URL.bot(bot.id)}))`)), null, makeDiscordCodeblock(diff(JSON.stringify(bot.owners.map(el => el.id)), JSON.stringify(validated.owners)), 'diff'))
		return ResponseWrapper(res, { code: 200 })
	})

interface PostApiRequest extends NextApiRequest {
  query: {
    id: string
  },
  body: EditBotOwner
}

export default BotOwners