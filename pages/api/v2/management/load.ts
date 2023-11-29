import { NextApiHandler } from 'next'
import { getMainGuild } from '@utils/DiscordBot'
import RequestHandler from '@utils/RequestHandler'

const LoadAPI: NextApiHandler = RequestHandler().get(async (req, res) => {
	getMainGuild() // Load Discord Bot
	res.status(200).json({ load: 'success' })
})

export default LoadAPI
