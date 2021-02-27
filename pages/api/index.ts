import ResponseWrapper from '@utils/ResponseWrapper'
import { getMainGuild } from '@utils/DiscordBot'
import RequestHandler from '@utils/RequestHandler'

const HelloWorld = RequestHandler
	.get(async(_req, res) => {
		getMainGuild() // Load Discord Bot
		return ResponseWrapper(res, { code: 200, message: '>_<' })
	})

export default HelloWorld
