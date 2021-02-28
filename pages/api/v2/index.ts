import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getMainGuild } from '@utils/DiscordBot'

const HelloWorld: NextApiHandler = (_req: NextApiRequest, res: NextApiResponse) => {
	getMainGuild() // Load Discord Bot
	res.statusCode = 200
	res.json({ happy: 'hacking' })
}

export default HelloWorld
