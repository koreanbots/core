import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import ResponseWrapper from '@utils/ResponseWrapper'
import { getMainGuild } from '@utils/DiscordBot'

const HelloWorld = nc<NextApiRequest, NextApiResponse>()
	.get(async(_req, res) => {
		getMainGuild() // Load Discord Bot
		return ResponseWrapper(res, { code: 200, message: '>_<' })
	})

export default HelloWorld
