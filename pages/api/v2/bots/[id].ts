import { get } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const BotInfo = nc<ApiRequest, NextApiResponse>()
	.get(async(req, res) => {
		const bot = await get.bot.load(req.query.id)
		if(!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		else return ResponseWrapper(res, { code: 200, data: bot })
	})

interface ApiRequest extends NextApiRequest {
	query: {
		id: string
	}
}

export default BotInfo