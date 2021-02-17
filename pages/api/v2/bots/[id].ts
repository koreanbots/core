import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import { get } from '@utils/Query'
import ResponseWrapper from '@utils/ResponseWrapper'
import { checkToken } from '@utils/Csrf'
import { AddBotSubmit, AddBotSubmitSchema } from '@utils/Yup'

const BotInfo = nc<ApiRequest, NextApiResponse>()
	.get(async(req, res) => {
		const bot = await get.bot.load(req.query.id)
		if(!bot) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.' })
		else return ResponseWrapper(res, { code: 200, data: bot })
	})
	.post(async (req, res) => {
		const user = await get.Authorization(req.cookies.token)
		console.log(user)
		if(!user) return ResponseWrapper(res, { code: 401 })
		const csrfValidated = checkToken(req, res, req.body._csrf)
		if(!csrfValidated) return

		const validated = await AddBotSubmitSchema.validate(req.body, { abortEarly: false }).then(el => el).catch(e => {
			ResponseWrapper(res, { code: 400, errors: e.errors })
			return null
		})

		if(!validated) return
		if(validated.id !== req.query.id) return ResponseWrapper(res, { code: 400, errors: ['요청 주소와 Body의 정보가 다릅니다.'] })
		return ResponseWrapper(res, { code: 200, data: { url: '/pendingBots/00000/00000' } })
	})
	.patch(async (req, res) => {
		return res.send('Reserved')
	})

interface ApiRequest extends NextApiRequest {
	body: AddBotSubmit
	query: {
		id: string
	}
}

export default BotInfo