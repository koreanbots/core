import { NextApiRequest, NextApiResponse } from 'next'
import { generateOauthURL } from '@utils/Tools'
import RequestHandler from '@utils/RequestHandler'

const Discord = RequestHandler().get(async (_req: NextApiRequest, res: NextApiResponse) => {
	res.redirect(
		301,
		generateOauthURL('discord', process.env.DISCORD_CLIENT_ID, process.env.DISCORD_SCOPE)
	)
})

export default Discord
