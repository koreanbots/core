import { NextApiRequest, NextApiResponse } from 'next'
import { generateOauthURL } from '@utils/Tools'
import { getDiscordOAuthScope } from '@utils/DiscordOAuth'
import RequestHandler from '@utils/RequestHandler'

const Discord = RequestHandler().get(async (_req: NextApiRequest, res: NextApiResponse) => {
	res.redirect(
		302,
		generateOauthURL('discord', process.env.DISCORD_CLIENT_ID, getDiscordOAuthScope())
	)
})

export default Discord
