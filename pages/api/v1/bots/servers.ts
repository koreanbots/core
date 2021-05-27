import { NextApiRequest} from 'next'
import rateLimit from 'express-rate-limit'

import { get, update } from '@utils/Query'
import RequestHandler from '@utils/RequestHandler'
import ResponseWrapper from '@utils/ResponseWrapper'
import { BotStatUpdate, BotStatUpdateSchema } from '@utils/Yup'

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 1,
	statusCode: 429,
	handler: (_req, res) => ResponseWrapper(res, { code: 429, version: 1 }),
	keyGenerator: (req) => req.headers.authorization,
	skip: (req, res) => {
		res.removeHeader('X-RateLimit-Global')
		if(!req.headers.authorization) return true
		else return false
	}
})

const BotStats = RequestHandler()
	.post(limiter)
	.post(async (req: PostApiRequest, res) => {
		const bot = await get.BotAuthorization(req.headers.token)
		if(!bot) return ResponseWrapper(res, { code: 401, version: 1 })
		const validated: BotStatUpdate = await BotStatUpdateSchema.validate(req.body, { abortEarly: false })
			.then(el => el)
			.catch(e => {
				ResponseWrapper(res, { code: 400, errors: e.errors })
				return null
			})
      
		if(!validated) return
		const botInfo = await get.bot.load(bot)
		if(!botInfo) return ResponseWrapper(res, { code: 404, message: '존재하지 않는 봇입니다.', version: 1 })
		if(botInfo.id !== bot) return ResponseWrapper(res, { code: 403, version: 1 })
		const d = await update.updateServer(botInfo.id, validated.servers)
		if(d===1 || d===2) return ResponseWrapper(res, { code: 403, message: `서버 수를 ${[null, '1만', '100만'][d]} 이상으로 설정하실 수 없습니다. 문의해주세요.`, version: 1 })
		return ResponseWrapper(res, { code: 200, message: '성공적으로 업데이트 했습니다.', version: 1 })
	})


interface PostApiRequest extends NextApiRequest {
  headers: {
    token: string
  }
  body: BotStatUpdate
}

export default BotStats