import { NextApiHandler } from 'next'
import { getMainGuild } from '@utils/DiscordBot'
import RequestHandler from '@utils/RequestHandler'

const HelloWorld: NextApiHandler = RequestHandler().all(async (req, res) => {
	getMainGuild() // Load Discord Bot
	res.status(200).json({ happy: 'hacking' })
})

export default HelloWorld
