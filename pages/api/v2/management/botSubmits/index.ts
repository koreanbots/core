import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { get } from '@utils/Query'
import { DiscordBot } from '@utils/DiscordBot'

const BotSubmits = RequestHandler()
	.get(async (req, res) => {
		const bot = await get.BotAuthorization(req.headers.authorization)
		if(bot !== DiscordBot.user.id) return ResponseWrapper(res, { code: 403 })
		const submits = await get.botSubmitList()
		return ResponseWrapper(res, { code: 200, data: submits })
	})

export default BotSubmits